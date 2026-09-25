import json
import urllib.request
import urllib.error
import sys

if sys.platform.startswith("win"):
    try:
        sys.stdout.reconfigure(encoding="utf-8")
    except Exception:
        pass

BASE = "http://127.0.0.1:8000/api/v1"


def api_call(path, data=None, method="GET", headers=None):
    if headers is None:
        headers = {}
    url = f"{BASE}{path}"
    body = json.dumps(data).encode() if data is not None else None
    if body and "Content-Type" not in headers:
        headers["Content-Type"] = "application/json"
    req = urllib.request.Request(url, data=body, headers=headers, method=method)
    try:
        res = urllib.request.urlopen(req)
        content = res.read().decode()
        return res.status, json.loads(content) if content else {}
    except urllib.error.HTTPError as e:
        err_body = e.read().decode()
        try:
            return e.code, json.loads(err_body)
        except Exception:
            return e.code, {"detail": err_body}


def run_tests():
    print("🚀 Starting Order API Verification Tests...")

    # Step 0a: Login as customer to get genuine JWT Bearer token
    login_code, login_res = api_call("/auth/demo-login", data={"email": "customer@shopai.com"}, method="POST")
    assert login_code == 200, f"Customer login failed: {login_res}"
    cust_token = login_res["access_token"]
    cust_headers = {"Authorization": f"Bearer {cust_token}"}

    # Step 0b: Check initial product stock for Product 1 (Sony) and Product 4 (Keychron)
    _, p1_before = api_call("/products/1")
    _, p4_before = api_call("/products/4")
    p1_stock_init = p1_before["stock"]
    p4_stock_init = p4_before["stock"]
    print(f"Initial stock: Product #1 = {p1_stock_init}, Product #4 = {p4_stock_init}")

    # Test 1: Place a valid order (1x Product 1, 2x Product 4)
    expected_total = round(p1_before["price"] * 1 + p4_before["price"] * 2, 2)
    order_payload = {
        "items": [
            {"product_id": 1, "quantity": 1},
            {"product_id": 4, "quantity": 2},
        ]
    }
    status_code, order_res = api_call("/orders", data=order_payload, method="POST", headers=cust_headers)
    assert status_code == 201, f"Expected 201, got {status_code}: {order_res}"
    order_id = order_res["id"]
    assert order_res["total_amount"] == expected_total, f"Total mismatch: {order_res['total_amount']} != {expected_total}"
    assert order_res["status"] == "PENDING"
    assert order_res["payment_status"] == "PENDING"
    assert len(order_res["items"]) == 2
    print(f"✅ TEST 1 PASSED: Created order #{order_id} with backend calculated total INR {order_res['total_amount']}")

    # Test 2: Verify stock was deducted
    _, p1_after = api_call("/products/1")
    _, p4_after = api_call("/products/4")
    assert p1_after["stock"] == p1_stock_init - 1, f"Stock P1 mismatch: {p1_after['stock']} vs {p1_stock_init - 1}"
    assert p4_after["stock"] == p4_stock_init - 2, f"Stock P4 mismatch: {p4_after['stock']} vs {p4_stock_init - 2}"
    print(f"✅ TEST 2 PASSED: Stock correctly decremented! Product #1: {p1_stock_init}->{p1_after['stock']}, Product #4: {p4_stock_init}->{p4_after['stock']}")

    # Test 3: Insufficient stock rejection
    excessive_payload = {
        "items": [{"product_id": 1, "quantity": 9999}]
    }
    code3, res3 = api_call("/orders", data=excessive_payload, method="POST", headers=cust_headers)
    assert code3 == 400, f"Expected 400, got {code3}: {res3}"
    print(f"✅ TEST 3 PASSED: Insufficient stock rejected with 400: {res3.get('detail')}")

    # Test 4: Non-existent product rejection
    invalid_product_payload = {
        "items": [{"product_id": 99999, "quantity": 1}]
    }
    code4, res4 = api_call("/orders", data=invalid_product_payload, method="POST", headers=cust_headers)
    assert code4 == 404, f"Expected 404, got {code4}: {res4}"
    print(f"✅ TEST 4 PASSED: Non-existent product rejected with 404: {res4.get('detail')}")

    # Test 5: Zero/negative quantity validation
    zero_qty_payload = {
        "items": [{"product_id": 1, "quantity": 0}]
    }
    code5, res5 = api_call("/orders", data=zero_qty_payload, method="POST", headers=cust_headers)
    assert code5 in (400, 422), f"Expected 400 or 422, got {code5}: {res5}"
    print(f"✅ TEST 5 PASSED: Zero quantity rejected with {code5}")

    # Test 6: GET /orders (list customer orders)
    code6, my_orders = api_call("/orders", method="GET", headers=cust_headers)
    assert code6 == 200
    assert len(my_orders) >= 1
    assert any(o["id"] == order_id for o in my_orders)
    print(f"✅ TEST 6 PASSED: GET /orders returned {len(my_orders)} order(s) for customer")

    # Test 7: GET /orders/{order_id} (get order details)
    code7, order_details = api_call(f"/orders/{order_id}", method="GET", headers=cust_headers)
    assert code7 == 200
    assert order_details["id"] == order_id
    assert len(order_details["items"]) == 2
    print(f"✅ TEST 7 PASSED: GET /orders/{order_id} returned order details with items")

    # Test 8: Non-existent order (404)
    code8, res8 = api_call("/orders/999999", method="GET", headers=cust_headers)
    assert code8 == 404
    print(f"✅ TEST 8 PASSED: GET /orders/999999 returned 404: {res8.get('detail')}")

    # Test 9: Unauthorized order access (customer isolation / 403 Forbidden with verified JWT)
    _, stranger_auth = api_call("/auth/demo-login", data={"email": "stranger@shopai.com"}, method="POST")
    stranger_token = stranger_auth["access_token"]
    code9, res9 = api_call(
        f"/orders/{order_id}",
        method="GET",
        headers={"Authorization": f"Bearer {stranger_token}"},
    )
    assert code9 == 403, f"Expected 403, got {code9}: {res9}"
    print(f"✅ TEST 9 PASSED: Unauthorized order access blocked with 403: {res9.get('detail')}")

    print("\n🎉 ALL BACKEND ORDER API TESTS PASSED SUCCESSFULLY!")


if __name__ == "__main__":
    run_tests()
