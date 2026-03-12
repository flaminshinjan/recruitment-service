#!/bin/bash
set -e
BASE="http://localhost:3000"

echo "1. Health check"
curl -s "$BASE/health" | grep -q ok && echo "OK" || exit 1

echo "2. Create candidate"
C1=$(curl -s -X POST "$BASE/candidates" -H "Content-Type: application/json" -d '{"name":"Alice","email":"alice@example.com","phone":"+1234567890"}')
echo "$C1" | grep -q '"id"' && echo "OK" || (echo "FAIL: $C1" && exit 1)

echo "3. Create job"
J1=$(curl -s -X POST "$BASE/jobs" -H "Content-Type: application/json" -d '{"title":"Software Engineer","description":"Full stack developer","location":"Remote"}')
echo "$J1" | grep -q '"id"' && echo "OK" || (echo "FAIL: $J1" && exit 1)

CANDIDATE_ID=$(echo "$C1" | grep -o '"id":[0-9]*' | cut -d: -f2)
JOB_ID=$(echo "$J1" | grep -o '"id":[0-9]*' | cut -d: -f2)

echo "4. Apply with candidate_id"
curl -s -X POST "$BASE/applications" -H "Content-Type: application/json" -d "{\"candidate_id\":$CANDIDATE_ID,\"job_id\":$JOB_ID}" | grep -q '"id"' && echo "OK" || exit 1

echo "5. Apply with new candidate details"
curl -s -X POST "$BASE/applications" -H "Content-Type: application/json" -d "{\"job_id\":$JOB_ID,\"candidate\":{\"name\":\"Bob\",\"email\":\"bob@example.com\"}}" | grep -q '"id"' && echo "OK" || exit 1

echo "6. Search candidates (Elasticsearch)"
curl -s "$BASE/search/candidates?q=alice" | grep -q '"id"' && echo "OK" || echo "SKIP (ES may not be running)"

echo "7. List candidates"
curl -s "$BASE/candidates" | grep -q '"id"' && echo "OK" || exit 1

echo "8. List jobs"
curl -s "$BASE/jobs" | grep -q '"id"' && echo "OK" || exit 1

echo "9. List applications"
curl -s "$BASE/applications" | grep -q '"id"' && echo "OK" || exit 1

echo "All tests passed"
