# Manual Verification — Postgres Migration

Run these steps after `docker-compose up --build` to verify the migration works end-to-end.

The backend is exposed at **http://localhost:4500**.

---

## 1. Health Check

```bash
curl http://localhost:4500/api/health
```

Expected: `{"status":"ok"}`

---

## 2. Seed the Database

```bash
docker exec edurev-rwanda-backend node seed.js
```

Expected output:
```
PostgreSQL Connected
Database schema initialized
Cleared existing data
Seeded 11 subjects
Seeded N topics
Seeded 12 questions
Done!
```

---

## 3. Subjects

**List all:**
```bash
curl http://localhost:4500/api/subjects
```
Expected: JSON array with 11 objects, each having `_id`, `name`, `level`.

**Get single:**
```bash
# Copy any _id from the list above
curl http://localhost:4500/api/subjects/<subject-id>
```
Expected: Single object with `_id`, `name`, `level`.

---

## 4. Topics

```bash
# Use a subject _id from step 3
curl "http://localhost:4500/api/topics/<subject-id>"
```
Expected: Array of topics. Each has:
- `_id`, `title`, `chapter`, `chapterTitle`, `difficulty`
- `summary` (JSON array), `content` (JSON array of objects), `references` (JSON array)
- `subject` (nested object with `_id`, `name`, `level`)

**Sort by title:**
```bash
curl "http://localhost:4500/api/topics/<subject-id>?sortBy=title"
```

---

## 5. Questions (Quiz)

```bash
# Use a topic _id that has questions (e.g. "Number Systems")
curl http://localhost:4500/api/questions/<topic-id>
```
Expected: Array of questions. Each has `_id`, `questionText`, `options`. **No `correctAnswer` field.**

**Submit quiz:**
```bash
# Use the _id values from the questions above
curl -X POST http://localhost:4500/api/questions/<topic-id>/submit \
  -H "Content-Type: application/json" \
  -d '{"answers":{"<q1-id>":1,"<q2-id>":1,"<q3-id>":2}}'
```
Expected: `{"score":3,"total":3,"results":[...]}` (if answers are correct).

---

## 6. Auth — Register

```bash
curl -X POST http://localhost:4500/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","password":"Pass123"}'
```
Expected (201):
```json
{
  "token": "eyJ...",
  "user": {"_id":"...","name":"Test User","email":"test@example.com","role":"student"}
}
```

**Verify row in DB:**
```bash
docker exec edurev-rwanda-postgres psql -U edurev -d edurev_rwanda \
  -c "SELECT id, name, email, role FROM users;"
```

---

## 7. Auth — Login

```bash
curl -X POST http://localhost:4500/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"Pass123"}'
```
Expected (200): Same shape as register — `token` + `user`.

---

## 8. Auth — Get Current User

```bash
# Use the token from login/register
curl http://localhost:4500/api/auth/me \
  -H "Authorization: Bearer <token>"
```
Expected: `{"_id":"...","name":"Test User","email":"test@example.com","role":"student"}`

---

## 9. Forum — Create Post (authenticated)

```bash
curl -X POST http://localhost:4500/api/forum/<topic-id> \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{"title":"My Question","content":"How does algebra work?"}'
```
Expected (201): Post object with nested `user` (`_id`, `name`).

**Fetch posts:**
```bash
curl http://localhost:4500/api/forum/<topic-id>
```
Expected: Array with the post, including `user.name` from the JOIN.

---

## 10. Forum — Reject Unauthenticated

```bash
curl -X POST http://localhost:4500/api/forum/<topic-id> \
  -H "Content-Type: application/json" \
  -d '{"title":"Anon","content":"Should fail"}'
```
Expected (401): `{"message":"Not authorized"}`

---

## 11. Verify Postgres Directly

```bash
docker exec edurev-rwanda-postgres psql -U edurev -d edurev_rwanda \
  -c "\dt"
```
Expected: 5 tables — `users`, `subjects`, `topics`, `questions`, `forum_posts`.
