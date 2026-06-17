#!/bin/bash
set -e

API_URL="${API_URL:-http://localhost:4015/api}"
PASS=0
FAIL=0

assert_status() {
  local name="$1"
  local expected="$2"
  local actual="$3"
  if [ "$actual" -eq "$expected" ]; then
    echo "✅ $name (HTTP $actual)"
    PASS=$((PASS + 1))
  else
    echo "❌ $name (expected $expected, got $actual)"
    FAIL=$((FAIL + 1))
  fi
}

echo "=== TenPulse Integration Tests ==="
echo "API: $API_URL"
echo ""

HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" "$API_URL/health")
assert_status "Health Check" 200 "$HTTP_CODE"

LOGIN_RESPONSE=$(curl -s -w "\n%{http_code}" "$API_URL/auth/login" \
  -H 'Content-Type: application/json' \
  -d '{"email":"demo@suncourtstennis.com","password":"demo123456"}')
HTTP_CODE=$(echo "$LOGIN_RESPONSE" | tail -1)
BODY=$(echo "$LOGIN_RESPONSE" | sed '$d')
assert_status "Login" 200 "$HTTP_CODE"

TOKEN=$(echo "$BODY" | python3 -c "import sys,json; print(json.load(sys.stdin)['accessToken'])" 2>/dev/null || echo "")

if [ -z "$TOKEN" ]; then
  echo "❌ Could not extract token"
  exit 1
fi

HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" "$API_URL/dashboard/stats" -H "Authorization: Bearer $TOKEN")
assert_status "Dashboard Stats" 200 "$HTTP_CODE"

HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" "$API_URL/courts" -H "Authorization: Bearer $TOKEN")
assert_status "List Courts" 200 "$HTTP_CODE"

HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" "$API_URL/lesson-sessions" -H "Authorization: Bearer $TOKEN")
assert_status "List Lesson Sessions" 200 "$HTTP_CODE"

HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" "$API_URL/ball-machine-maintenance" -H "Authorization: Bearer $TOKEN")
assert_status "List Ball Machine Maintenance" 200 "$HTTP_CODE"

HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" "$API_URL/court-maintenance" -H "Authorization: Bearer $TOKEN")
assert_status "List Court Maintenance" 200 "$HTTP_CODE"

HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" "$API_URL/stringing-orders" -H "Authorization: Bearer $TOKEN")
assert_status "List Stringing Orders" 200 "$HTTP_CODE"

HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" "$API_URL/rate-tiers" -H "Authorization: Bearer $TOKEN")
assert_status "List Rate Tiers" 200 "$HTTP_CODE"

HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" "$API_URL/tennis-club" -H "Authorization: Bearer $TOKEN")
assert_status "Tennis Club Profile" 200 "$HTTP_CODE"

HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" "$API_URL/ball-machine-maintenance/urgent" -H "Authorization: Bearer $TOKEN")
assert_status "Urgent Ball Machine Maintenance" 200 "$HTTP_CODE"

HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" "$API_URL/stringing-orders/pending" -H "Authorization: Bearer $TOKEN")
assert_status "Pending Stringing Orders" 200 "$HTTP_CODE"

CREATE_COURT=$(curl -s -w "\n%{http_code}" "$API_URL/courts" \
  -H "Authorization: Bearer $TOKEN" \
  -H 'Content-Type: application/json' \
  -d '{"name":"Test Court #99","wing":"Practice Wing","surfaceType":"hard","notes":"Integration test court"}')
HTTP_CODE=$(echo "$CREATE_COURT" | tail -1)
assert_status "Create Court" 201 "$HTTP_CODE"

COURT_ID=$(echo "$CREATE_COURT" | sed '$d' | python3 -c "import sys,json; print(json.load(sys.stdin)['id'])" 2>/dev/null || echo "")

if [ -n "$COURT_ID" ]; then
  HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" "$API_URL/courts/$COURT_ID" \
    -H "Authorization: Bearer $TOKEN" \
    -H 'Content-Type: application/json' \
    -X PATCH \
    -d '{"status":"maintenance"}')
  assert_status "Update Court" 200 "$HTTP_CODE"

  HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" "$API_URL/courts/$COURT_ID" \
    -H "Authorization: Bearer $TOKEN" \
    -X DELETE)
  assert_status "Delete Court" 200 "$HTTP_CODE"
fi

CREATE_STRINGING=$(curl -s -w "\n%{http_code}" "$API_URL/stringing-orders" \
  -H "Authorization: Bearer $TOKEN" \
  -H 'Content-Type: application/json' \
  -d '{"customerName":"Test Customer","racketBrand":"Wilson Pro Staff","stringType":"Luxilon ALU Power","tension":"55 lbs","price":35}')
HTTP_CODE=$(echo "$CREATE_STRINGING" | tail -1)
assert_status "Create Stringing Order" 201 "$HTTP_CODE"

STRINGING_ID=$(echo "$CREATE_STRINGING" | sed '$d' | python3 -c "import sys,json; print(json.load(sys.stdin)['id'])" 2>/dev/null || echo "")

if [ -n "$STRINGING_ID" ]; then
  HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" "$API_URL/stringing-orders/$STRINGING_ID" \
    -H "Authorization: Bearer $TOKEN" \
    -H 'Content-Type: application/json' \
    -X PATCH \
    -d '{"status":"in_progress"}')
  assert_status "Update Stringing Order" 200 "$HTTP_CODE"

  HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" "$API_URL/stringing-orders/$STRINGING_ID" \
    -H "Authorization: Bearer $TOKEN" \
    -X DELETE)
  assert_status "Delete Stringing Order" 200 "$HTTP_CODE"
fi

HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" "$API_URL/dashboard/stats")
assert_status "Unauthorized Access" 401 "$HTTP_CODE"

echo ""
echo "=== Results: $PASS passed, $FAIL failed ==="
[ "$FAIL" -eq 0 ] && exit 0 || exit 1
