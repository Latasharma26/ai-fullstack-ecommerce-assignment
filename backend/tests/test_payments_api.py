import sys
import json
import urllib.request
import urllib.error

if sys.platform.startswith("win"):
    sys.stdout.reconfigure(encoding="utf-8")

BASE_URL = "http://127.0.0.1:8000"

def run_tests():
    print("🚀 Testing Stripe Payment Endpoints...")

    # 1. Login as customer to get token
    login_data = json.dumps({"email": "customer@shopai.com"}).encode("utf-8")
    req = urllib.request.Request(
        f"{BASE_URL}/api/v1/auth/demo-login",
        data=login_data,
        headers={"Content-Type": "application/json"}
    )
    auth_res = json.loads(urllib.request.urlopen(req).read().decode("utf-8"))
    token = auth_res["access_token"]
    headers = {
        "Content-Type": "application/json",
        "Authorization": f"Bearer {token}",
    }

    # 2. Create an order to pay for
    order_data = json.dumps({
        "items": [{"product_id": 1, "quantity": 1}]
    }).encode("utf-8")
    req_order = urllib.request.Request(
        f"{BASE_URL}/api/v1/orders",
        data=order_data,
        headers=headers,
    )
    order_res = json.loads(urllib.request.urlopen(req_order).read().decode("utf-8"))
    order_id = order_res["id"]
    print(f"✅ Created Order #{order_id} with status={order_res['status']}, payment_status={order_res['payment_status']}")
    assert order_res["payment_status"] == "PENDING"

    # 3. Create Checkout Session
    session_data = json.dumps({"order_id": order_id}).encode("utf-8")
    req_session = urllib.request.Request(
        f"{BASE_URL}/api/v1/payments/create-checkout-session",
        data=session_data,
        headers=headers,
    )
    session_res = json.loads(urllib.request.urlopen(req_session).read().decode("utf-8"))
    print(f"✅ Checkout Session Created: session_id={session_res['session_id']}, simulated={session_res['simulated']}")
    assert "session_id" in session_res
    assert "checkout_url" in session_res

    # 4. Simulate payment success
    req_sim = urllib.request.Request(
        f"{BASE_URL}/api/v1/payments/simulate/{order_id}",
        data=b"{}",
        headers=headers,
    )
    sim_res = json.loads(urllib.request.urlopen(req_sim).read().decode("utf-8"))
    print(f"✅ Payment Simulated: payment_status={sim_res['payment_status']}, order_status={sim_res['order_status']}")
    assert sim_res["payment_status"] == "PAID"
    assert sim_res["order_status"] == "CONFIRMED"

    # 5. Verify order is now PAID
    req_verify = urllib.request.Request(
        f"{BASE_URL}/api/v1/orders/{order_id}",
        headers=headers,
    )
    verified_order = json.loads(urllib.request.urlopen(req_verify).read().decode("utf-8"))
    print(f"✅ Verified Order #{order_id} in DB: payment_status={verified_order['payment_status']}, status={verified_order['status']}")
    assert verified_order["payment_status"] == "PAID"
    assert verified_order["status"] == "CONFIRMED"

    # 6. Reject second payment for already paid order
    try:
        urllib.request.urlopen(req_session)
        print("❌ Expected 400 for already paid order but succeeded")
    except urllib.error.HTTPError as e:
        print(f"✅ Rejected second payment for paid order: {e.code}")
        assert e.code == 400

    print("\n🎉 ALL PAYMENT ENDPOINT TESTS PASSED SUCCESSFULLY!")

if __name__ == "__main__":
    run_tests()
