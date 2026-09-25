import sys
import json
import urllib.request
import urllib.error

if sys.platform.startswith("win"):
    sys.stdout.reconfigure(encoding="utf-8")

BASE_URL = "http://127.0.0.1:8000"

def run_tests():
    print("🚀 Testing Admin Dashboard & RBAC Endpoints...")

    # 1. Login as Admin
    admin_login = json.dumps({"email": "admin@shopai.com"}).encode("utf-8")
    req_admin_auth = urllib.request.Request(
        f"{BASE_URL}/api/v1/auth/demo-login",
        data=admin_login,
        headers={"Content-Type": "application/json"}
    )
    admin_auth = json.loads(urllib.request.urlopen(req_admin_auth).read().decode("utf-8"))
    admin_token = admin_auth["access_token"]
    admin_headers = {
        "Content-Type": "application/json",
        "Authorization": f"Bearer {admin_token}",
    }

    # 2. Login as Customer
    cust_login = json.dumps({"email": "customer@shopai.com"}).encode("utf-8")
    req_cust_auth = urllib.request.Request(
        f"{BASE_URL}/api/v1/auth/demo-login",
        data=cust_login,
        headers={"Content-Type": "application/json"}
    )
    cust_auth = json.loads(urllib.request.urlopen(req_cust_auth).read().decode("utf-8"))
    cust_token = cust_auth["access_token"]
    cust_headers = {
        "Content-Type": "application/json",
        "Authorization": f"Bearer {cust_token}",
    }

    # 3. RBAC Test: Customer should get 403 when requesting admin stats
    req_forbidden = urllib.request.Request(f"{BASE_URL}/api/v1/admin/stats", headers=cust_headers)
    try:
        urllib.request.urlopen(req_forbidden)
        print("❌ Customer was improperly allowed to access admin stats")
        assert False
    except urllib.error.HTTPError as e:
        print(f"✅ RBAC check passed: Customer blocked from admin stats with {e.code}")
        assert e.code == 403

    # 4. Admin accesses stats
    req_stats = urllib.request.Request(f"{BASE_URL}/api/v1/admin/stats", headers=admin_headers)
    stats = json.loads(urllib.request.urlopen(req_stats).read().decode("utf-8"))
    print(f"✅ Admin Stats: Revenue=₹{stats['total_revenue']}, Orders={stats['total_orders']}, Products={stats['total_products']}")
    assert "total_revenue" in stats
    assert "total_orders" in stats

    # 5. Admin lists all orders
    req_orders = urllib.request.Request(f"{BASE_URL}/api/v1/admin/orders", headers=admin_headers)
    all_orders = json.loads(urllib.request.urlopen(req_orders).read().decode("utf-8"))
    print(f"✅ Admin listed {len(all_orders)} total orders in system")
    assert isinstance(all_orders, list)

    # 6. Admin updates order status
    if all_orders:
        target_id = all_orders[0]["id"]
        patch_data = json.dumps({"status": "SHIPPED"}).encode("utf-8")
        req_patch = urllib.request.Request(
            f"{BASE_URL}/api/v1/admin/orders/{target_id}/status",
            data=patch_data,
            headers=admin_headers,
            method="PATCH",
        )
        updated_order = json.loads(urllib.request.urlopen(req_patch).read().decode("utf-8"))
        print(f"✅ Order #{target_id} updated to status={updated_order['status']}")
        assert updated_order["status"] == "SHIPPED"

    print("\n🎉 ALL ADMIN API & RBAC TESTS PASSED SUCCESSFULLY!")

if __name__ == "__main__":
    run_tests()
