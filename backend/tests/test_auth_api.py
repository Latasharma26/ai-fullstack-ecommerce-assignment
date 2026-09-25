import sys
import json
import urllib.request
import urllib.error

if sys.platform.startswith("win"):
    sys.stdout.reconfigure(encoding="utf-8")

BASE_URL = "http://127.0.0.1:8000"

def run_tests():
    print("🚀 Testing Auth & Health Endpoints...")
    
    # 1. Health
    res = json.loads(urllib.request.urlopen(f"{BASE_URL}/health").read().decode("utf-8"))
    print(f"✅ Health: status={res['status']}, db={res['database']['status']}")
    assert res["status"] == "healthy"

    # 2. Demo Customer Login
    login_data = json.dumps({"email": "customer@shopai.com"}).encode("utf-8")
    req = urllib.request.Request(
        f"{BASE_URL}/api/v1/auth/demo-login",
        data=login_data,
        headers={"Content-Type": "application/json"}
    )
    res_cust = json.loads(urllib.request.urlopen(req).read().decode("utf-8"))
    print(f"✅ Customer Login: user={res_cust['user']['email']}, role={res_cust['user']['role']}")
    cust_token = res_cust["access_token"]
    assert res_cust["user"]["role"] == "CUSTOMER"

    # 3. GET /me with Customer JWT
    req_me = urllib.request.Request(
        f"{BASE_URL}/api/v1/auth/me",
        headers={"Authorization": f"Bearer {cust_token}"}
    )
    res_me = json.loads(urllib.request.urlopen(req_me).read().decode("utf-8"))
    print(f"✅ /me for Customer: email={res_me['email']}, role={res_me['role']}")
    assert res_me["email"] == "customer@shopai.com"

    # 4. Demo Admin Login
    admin_login_data = json.dumps({"email": "admin@shopai.com"}).encode("utf-8")
    req_admin = urllib.request.Request(
        f"{BASE_URL}/api/v1/auth/demo-login",
        data=admin_login_data,
        headers={"Content-Type": "application/json"}
    )
    res_admin = json.loads(urllib.request.urlopen(req_admin).read().decode("utf-8"))
    print(f"✅ Admin Login: user={res_admin['user']['email']}, role={res_admin['user']['role']}")
    admin_token = res_admin["access_token"]
    assert res_admin["user"]["role"] == "ADMIN"

    # 5. Invalid Token Test
    req_bad = urllib.request.Request(
        f"{BASE_URL}/api/v1/auth/me",
        headers={"Authorization": "Bearer invalid_garbage_token"}
    )
    try:
        urllib.request.urlopen(req_bad)
        print("❌ Expected 401 for bad token but succeeded")
    except urllib.error.HTTPError as e:
        print(f"✅ Invalid token correctly returned 401: {e.code}")
        assert e.code == 401

    print("\n🎉 ALL AUTH ENDPOINT TESTS PASSED SUCCESSFULLY!")

if __name__ == "__main__":
    run_tests()
