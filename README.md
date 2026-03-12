# Recruitment Service

> Minimal recruitment backend: candidates, jobs, applications, and Elasticsearch-powered candidate search.

## Table of Contents

- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Setup](#setup)
- [API Flow](#api-flow)
- [API Reference](#api-reference)

---

## Tech Stack

| Layer       | Technology      |
|------------|------------------|
| Runtime    | Node.js + Express |
| Database   | MySQL + Prisma   |
| Search     | Elasticsearch 8  |
| Validation | Zod              |

---

## Project Structure

```
recruitment-service/
├── prisma/
│   └── schema.prisma
├── src/
│   ├── config/           # Prisma, Elasticsearch clients
│   ├── controllers/      # Request handlers
│   ├── services/         # Business logic
│   ├── routes/           # API route definitions
│   ├── generated/prisma/ # Prisma client (auto-generated)
│   ├── app.js            # Express app setup
│   └── server.js         # Entry point
├── .env.example
└── package.json
```

---

## Setup

### Prerequisites

- **Node.js** 18+
- **MySQL** 8
- **Elasticsearch** 8.x

### Steps

**1. Install dependencies**

```bash
npm install
```

**2. Configure environment**

Copy `.env.example` → `.env`:

```env
PORT=3000
DATABASE_URL="mysql://root:YOUR_PASSWORD@localhost:3306/recruitments_db"
ELASTICSEARCH_URL="http://localhost:9200"
```

**3. Database**

```bash
npm run db:generate
npm run db:push
```

**4. Start server**

```bash
npm run dev
```

→ Server runs at **http://localhost:3000**

---

## API Flow

```
Health → Candidates (CRUD) → Jobs (CRUD) → Applications (Apply) → Search (Elasticsearch)
```

| Step | Action |
|------|--------|
| 1 | Health check |
| 2 | Create candidates |
| 3 | Create jobs |
| 4 | Apply (with `candidate_id` or new candidate details) |
| 5 | Search candidates by name, email, or phone |

---

## API Reference

**Base URL:** `http://localhost:3000`

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/health` | Health check |
| POST | `/candidates` | Create candidate |
| GET | `/candidates` | List candidates |
| GET | `/candidates/:id` | Get candidate by id |
| POST | `/jobs` | Create job |
| GET | `/jobs` | List jobs |
| GET | `/jobs/:id` | Get job by id |
| POST | `/applications` | Apply to job |
| GET | `/applications` | List applications |
| GET | `/search/candidates?q=` | Search candidates |

---

### 1. Health Check

```bash
curl -s http://localhost:3000/health
```

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

```json
{"id":10,"name":"Alice Johnson","email":"alice@example.com","phone":"555-1111","createdAt":"2026-03-12T13:40:06.845Z"}
```

*Without phone (optional):*

```bash
curl -s -X POST http://localhost:3000/candidates \
  -H "Content-Type: application/json" \
  -d '{"name":"Bob Smith","email":"bob@example.com"}'
```

```json
{"id":11,"name":"Bob Smith","email":"bob@example.com","phone":null,"createdAt":"2026-03-12T13:40:13.663Z"}
```

---

### 3. List Candidates

```bash
curl -s http://localhost:3000/candidates
```

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

```json
{
  "id": 1,
  "name": "Alice",
  "email": "alice@test.com",
  "phone": "123",
  "createdAt": "2026-03-12T12:52:59.280Z",
  "applications": [
    {
      "id": 1,
      "candidateId": 1,
      "jobId": 1,
      "createdAt": "2026-03-12T12:53:07.443Z",
      "job": {"id": 1, "title": "Dev", "description": "Dev job", "location": "Remote"}
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

```json
{"id":5,"title":"Software Engineer","description":"Full stack developer role","location":"Remote","createdAt":"2026-03-12T13:40:32.546Z"}
```

```bash
curl -s -X POST http://localhost:3000/jobs \
  -H "Content-Type: application/json" \
  -d '{"title":"Product Manager","description":"Product ownership","location":"NYC"}'
```

```json
{"id":6,"title":"Product Manager","description":"Product ownership","location":"NYC","createdAt":"2026-03-12T13:40:40.372Z"}
```

---

### 6. List Jobs

```bash
curl -s http://localhost:3000/jobs
```

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

```json
{
  "id": 1,
  "title": "Dev",
  "description": "Dev job",
  "location": "Remote",
  "createdAt": "2026-03-12T12:53:07.425Z",
  "applications": [
    {
      "id": 1,
      "candidateId": 1,
      "jobId": 1,
      "candidate": {"id": 1, "name": "Alice", "email": "alice@test.com"}
    },
    {
      "id": 2,
      "candidateId": 2,
      "jobId": 1,
      "candidate": {"id": 2, "name": "Bob", "email": "bob@test.com"}
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

*Success:*
```json
{
  "id": 1,
  "candidateId": 1,
  "jobId": 1,
  "createdAt": "2026-03-12T12:53:07.443Z",
  "candidate": {"id": 1, "name": "Alice", "email": "alice@test.com"},
  "job": {"id": 1, "title": "Dev", "description": "Dev job"}
}
```

*Already applied:*
```json
{"error": "Already applied to this job"}
```

---

### 9. Apply with New Candidate Details

```bash
curl -s -X POST http://localhost:3000/applications \
  -H "Content-Type: application/json" \
  -d '{"job_id":1,"candidate":{"name":"Carol Williams","email":"carol@example.com","phone":"555-3333"}}'
```

```json
{
  "id": 10,
  "candidateId": 12,
  "jobId": 1,
  "createdAt": "2026-03-12T13:41:01.768Z",
  "candidate": {
    "id": 12,
    "name": "Carol Williams",
    "email": "carol@example.com",
    "phone": "555-3333",
    "createdAt": "2026-03-12T13:41:01.734Z"
  },
  "job": {"id": 1, "title": "Dev", "description": "Dev job", "location": "Remote"}
}
```

---

### 10. List Applications

```bash
curl -s http://localhost:3000/applications
```

```json
[
  {
    "id": 10,
    "candidateId": 12,
    "jobId": 1,
    "candidate": {"id": 12, "name": "Carol Williams", "email": "carol@example.com"},
    "job": {"id": 1, "title": "Dev", "description": "Dev job"}
  }
]
```

---

### 11. Search Candidates (Elasticsearch)

Searches across **name**, **email**, and **phone**.

```bash
curl -s "http://localhost:3000/search/candidates?q=alice"
```

```json
[
  {"id": 9, "name": "Alice", "email": "alice@example.com"},
  {"id": 10, "name": "Alice Johnson", "email": "alice@example.com"}
]
```

```bash
curl -s "http://localhost:3000/search/candidates?q=example.com"
```

```json
[
  {"id": 8, "name": "Test Search", "email": "search@example.com"},
  {"id": 9, "name": "Alice", "email": "alice@example.com"},
  {"id": 10, "name": "Alice Johnson", "email": "alice@example.com"},
  {"id": 11, "name": "Bob Smith", "email": "bob@example.com"},
  {"id": 12, "name": "Carol Williams", "email": "carol@example.com"}
]
```

*No matches:*
```bash
curl -s "http://localhost:3000/search/candidates?q=software"
```
```json
[]
```

> Search indexes candidates only. Job titles and descriptions are not searchable.
