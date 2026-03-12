# Recruitment Service

A minimal recruitment backend with candidates, jobs, applications, and Elasticsearch-powered candidate search.

## Tech Stack

- Node.js + Express
- MySQL + Prisma ORM
- Elasticsearch (candidate indexing & search)
- Zod (validation)

## Project Structure

```
src/
├── config/        # Prisma, Elasticsearch
├── controllers/   # Request handlers
├── services/      # Business logic
├── routes/        # API routes
├── generated/prisma/
├── app.js
└── server.js
```

## Setup

### Prerequisites

- Node.js 18+
- MySQL 8
- Elasticsearch 8.x

### 1. Install dependencies

```bash
npm install
```

### 2. Environment

Copy `.env.example` to `.env` and set:

```bash
PORT=3000
DATABASE_URL="mysql://root:YOUR_PASSWORD@localhost:3306/recruitments_db"
ELASTICSEARCH_URL="http://localhost:9200"
```

### 3. Database

```bash
npm run db:generate
npm run db:push
```

### 4. Start server

```bash
npm run dev
```

Server runs on `http://localhost:3000`.

## API Flow

1. **Health** → Check server status
2. **Candidates** → Create, list, get by id
3. **Jobs** → Create, list, get by id
4. **Applications** → Apply with `candidate_id` or with new candidate details
5. **Search** → Search candidates via Elasticsearch (name, email, phone)

## API Reference & Sample cURL

Base URL: `http://localhost:3000`

---

### 1. Health Check

```bash
curl -s http://localhost:3000/health
```

**Response:**
```json
{"status":"ok"}
```

---

### 2. Create Candidate

```bash
curl -s -X POST http://localhost:3000/candidates \
  -H "Content-Type: application/json" \
  -d '{"name":"Alice Johnson","email":"alice@example.com","phone":"555-1111"}'
```

**Response:**
```json
{"id":10,"name":"Alice Johnson","email":"alice@example.com","phone":"555-1111","createdAt":"2026-03-12T13:40:06.845Z"}
```

**Without phone (optional):**
```bash
curl -s -X POST http://localhost:3000/candidates \
  -H "Content-Type: application/json" \
  -d '{"name":"Bob Smith","email":"bob@example.com"}'
```

**Response:**
```json
{"id":11,"name":"Bob Smith","email":"bob@example.com","phone":null,"createdAt":"2026-03-12T13:40:13.663Z"}
```

---

### 3. List Candidates

```bash
curl -s http://localhost:3000/candidates
```

**Response:**
```json
[
  {"id":11,"name":"Bob Smith","email":"bob@example.com","phone":null,"createdAt":"2026-03-12T13:40:13.663Z"},
  {"id":10,"name":"Alice Johnson","email":"alice@example.com","phone":"555-1111","createdAt":"2026-03-12T13:40:06.845Z"}
]
```

---

### 4. Get Candidate by ID

```bash
curl -s http://localhost:3000/candidates/1
```

**Response:**
```json
{
  "id":1,
  "name":"Alice",
  "email":"alice@test.com",
  "phone":"123",
  "createdAt":"2026-03-12T12:52:59.280Z",
  "applications":[
    {
      "id":1,
      "candidateId":1,
      "jobId":1,
      "createdAt":"2026-03-12T12:53:07.443Z",
      "job":{"id":1,"title":"Dev","description":"Dev job","location":"Remote","createdAt":"2026-03-12T12:53:07.425Z"}
    }
  ]
}
```

---

### 5. Create Job

```bash
curl -s -X POST http://localhost:3000/jobs \
  -H "Content-Type: application/json" \
  -d '{"title":"Software Engineer","description":"Full stack developer role","location":"Remote"}'
```

**Response:**
```json
{"id":5,"title":"Software Engineer","description":"Full stack developer role","location":"Remote","createdAt":"2026-03-12T13:40:32.546Z"}
```

```bash
curl -s -X POST http://localhost:3000/jobs \
  -H "Content-Type: application/json" \
  -d '{"title":"Product Manager","description":"Product ownership","location":"NYC"}'
```

**Response:**
```json
{"id":6,"title":"Product Manager","description":"Product ownership","location":"NYC","createdAt":"2026-03-12T13:40:40.372Z"}
```

---

### 6. List Jobs

```bash
curl -s http://localhost:3000/jobs
```

**Response:**
```json
[
  {"id":6,"title":"Product Manager","description":"Product ownership","location":"NYC","createdAt":"2026-03-12T13:40:40.372Z"},
  {"id":5,"title":"Software Engineer","description":"Full stack developer role","location":"Remote","createdAt":"2026-03-12T13:40:32.546Z"}
]
```

---

### 7. Get Job by ID

```bash
curl -s http://localhost:3000/jobs/1
```

**Response:**
```json
{
  "id":1,
  "title":"Dev",
  "description":"Dev job",
  "location":"Remote",
  "createdAt":"2026-03-12T12:53:07.425Z",
  "applications":[
    {
      "id":1,
      "candidateId":1,
      "jobId":1,
      "createdAt":"2026-03-12T12:53:07.443Z",
      "candidate":{"id":1,"name":"Alice","email":"alice@test.com","phone":"123","createdAt":"2026-03-12T12:52:59.280Z"}
    },
    {
      "id":2,
      "candidateId":2,
      "jobId":1,
      "createdAt":"2026-03-12T12:53:15.221Z",
      "candidate":{"id":2,"name":"Bob","email":"bob@test.com","phone":null,"createdAt":"2026-03-12T12:53:07.458Z"}
    }
  ]
}
```

---

### 8. Apply with Existing Candidate ID

```bash
curl -s -X POST http://localhost:3000/applications \
  -H "Content-Type: application/json" \
  -d '{"candidate_id":1,"job_id":1}'
```

**Response (already applied):**
```json
{"error":"Already applied to this job"}
```

**Response (success):**
```json
{
  "id":1,
  "candidateId":1,
  "jobId":1,
  "createdAt":"2026-03-12T12:53:07.443Z",
  "candidate":{"id":1,"name":"Alice","email":"alice@test.com","phone":"123","createdAt":"2026-03-12T12:52:59.280Z"},
  "job":{"id":1,"title":"Dev","description":"Dev job","location":"Remote","createdAt":"2026-03-12T12:53:07.425Z"}
}
```

---

### 9. Apply with New Candidate Details

```bash
curl -s -X POST http://localhost:3000/applications \
  -H "Content-Type: application/json" \
  -d '{"job_id":1,"candidate":{"name":"Carol Williams","email":"carol@example.com","phone":"555-3333"}}'
```

**Response:**
```json
{
  "id":10,
  "candidateId":12,
  "jobId":1,
  "createdAt":"2026-03-12T13:41:01.768Z",
  "candidate":{
    "id":12,
    "name":"Carol Williams",
    "email":"carol@example.com",
    "phone":"555-3333",
    "createdAt":"2026-03-12T13:41:01.734Z"
  },
  "job":{"id":1,"title":"Dev","description":"Dev job","location":"Remote","createdAt":"2026-03-12T12:53:07.425Z"}
}
```

---

### 10. List Applications

```bash
curl -s http://localhost:3000/applications
```

**Response:**
```json
[
  {
    "id":10,
    "candidateId":12,
    "jobId":1,
    "createdAt":"2026-03-12T13:41:01.768Z",
    "candidate":{"id":12,"name":"Carol Williams","email":"carol@example.com","phone":"555-3333","createdAt":"2026-03-12T13:41:01.734Z"},
    "job":{"id":1,"title":"Dev","description":"Dev job","location":"Remote","createdAt":"2026-03-12T12:53:07.425Z"}
  }
]
```

---

### 11. Search Candidates (Elasticsearch)

Searches across name, email, and phone.

```bash
curl -s "http://localhost:3000/search/candidates?q=alice"
```

**Response:**
```json
[
  {"id":9,"name":"Alice","email":"alice@example.com","phone":"+1234567890","createdAt":"2026-03-12T13:38:27.512Z"},
  {"id":10,"name":"Alice Johnson","email":"alice@example.com","phone":"555-1111","createdAt":"2026-03-12T13:40:06.845Z"}
]
```

```bash
curl -s "http://localhost:3000/search/candidates?q=example.com"
```

**Response:**
```json
[
  {"id":8,"name":"Test Search","email":"search@example.com","phone":null,"createdAt":"2026-03-12T13:38:18.287Z"},
  {"id":9,"name":"Alice","email":"alice@example.com","phone":"+1234567890","createdAt":"2026-03-12T13:38:27.512Z"},
  {"id":10,"name":"Alice Johnson","email":"alice@example.com","phone":"555-1111","createdAt":"2026-03-12T13:40:06.845Z"},
  {"id":11,"name":"Bob Smith","email":"bob@example.com","phone":null,"createdAt":"2026-03-12T13:40:13.663Z"},
  {"id":12,"name":"Carol Williams","email":"carol@example.com","phone":"555-3333","createdAt":"2026-03-12T13:41:01.734Z"}
]
```

**No matches:**
```bash
curl -s "http://localhost:3000/search/candidates?q=software"
```
**Response:**
```json
[]
```

> Note: Search indexes candidates only. Job titles/descriptions are not searchable.

