import sys
import subprocess
import os

if sys.platform.startswith("win"):
    sys.stdout.reconfigure(encoding="utf-8")

TESTS = [
    ("Auth & RBAC Endpoints", "backend/tests/test_auth_api.py"),
    ("Order API & Stock Deduction", "backend/tests/test_orders_api.py"),
    ("Stripe Payments & Webhooks", "backend/tests/test_payments_api.py"),
    ("AI Support Agent & Database Tools", "backend/tests/test_ai_api.py"),
    ("Admin Dashboard & Order Status", "backend/tests/test_admin_api.py"),
    ("Comprehensive Security Audit (11 Tests)", "backend/tests/test_security_audit.py"),
]

def main():
    print("=" * 60)
    print("🌟 SHOPAI MASTER INTEGRATION TEST RUNNER 🌟")
    print("=" * 60)

    python_exe = sys.executable
    passed = 0
    failed = 0

    for name, test_file in TESTS:
        actual_path = os.path.join(os.path.dirname(__file__), os.path.basename(test_file))
        print(f"\n▶ Running: {name} ({actual_path})")
        print("-" * 50)
        res = subprocess.run([python_exe, actual_path])
        if res.returncode == 0:
            print(f"✅ PASSED: {name}")
            passed += 1
        else:
            print(f"❌ FAILED: {name} (exit code {res.returncode})")
            failed += 1

    print("\n" + "=" * 60)
    print(f"🏁 MASTER TEST SUMMARY: {passed} PASSED, {failed} FAILED out of {len(TESTS)} suites")
    print("=" * 60)

    if failed > 0:
        sys.exit(1)

if __name__ == "__main__":
    main()
