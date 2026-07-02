# JavaScript + Backend Topics Roadmap (Node.js Developer)

> Master list for interview prep. Tick off as you cover each topic. Use physical diary for theory/concepts, digital for code/snippets.

---

## Phase 1: JavaScript Fundamentals

- [ ] Execution context & call stack
- [ ] Hoisting (`var`/`let`/`const`, function declarations)
- [ ] Scope (global, function, block) & closures
- [ ] `this` keyword — all binding rules (default, implicit, explicit, `new`, arrow fn)
- [ ] Prototypes & prototypal inheritance
- [ ] Event loop — microtasks vs macrotasks
- [ ] `process.nextTick()` vs `setImmediate()` vs `setTimeout()`
- [ ] Promises — chaining, `Promise.all/race/allSettled/any`
- [ ] async/await + error handling patterns (try/catch, wrapper functions)
- [ ] `call`, `apply`, `bind`
- [ ] Higher-order functions, currying, debounce/throttle
- [ ] Destructuring, spread/rest operators, optional chaining (`?.`), nullish coalescing (`??`)
- [ ] Map/Set/WeakMap/WeakSet
- [ ] Garbage collection basics (mark-and-sweep)
- [ ] Event delegation & bubbling (if touching frontend integration)
- [ ] Generators & iterators (good to know conceptually)

---

## Phase 2: Backend Core (Node.js + Express)

- [ ] Node.js architecture — libuv, thread pool, single-threaded event loop
- [ ] Streams (readable/writable/duplex) & buffers
- [ ] Module systems — CommonJS vs ESM
- [ ] Clustering & worker threads (multi-core utilization)
- [ ] Middleware pattern & request lifecycle in Express
- [ ] Error-handling middleware, async error wrapping
- [ ] REST API design principles, proper HTTP status codes
- [ ] Authentication — JWT (access/refresh, rotation, reuse detection) vs sessions
- [ ] Authorization — RBAC/ABAC
- [ ] Input validation & sanitization (Zod/Joi)
- [ ] Rate limiting & throttling strategies
- [ ] File uploads — multipart, streaming to disk/cloud (Multer, S3)
- [ ] Environment config & secrets management (`dotenv`, vault basics)
- [ ] Logging (Winston/Pino) & monitoring basics
- [ ] API versioning strategies
- [ ] Pagination, filtering, sorting patterns

---

## Phase 3: Database Engineering

- [ ] MongoDB — schema design, indexing, aggregation pipeline
- [ ] SQL fundamentals — joins, normalization, transactions
- [ ] Indexing strategies & query optimization (EXPLAIN plans)
- [ ] TTL indexes, compound indexes, partial indexes
- [ ] Database connection pooling
- [ ] ACID properties & isolation levels
- [ ] ORMs/ODMs — Mongoose vs Prisma vs Sequelize trade-offs
- [ ] N+1 query problem & solutions
- [ ] Database migrations & seeding strategies
- [ ] Replication & sharding basics

---

## Phase 4: Caching & Performance

- [ ] Redis fundamentals — data types, TTL, pub/sub
- [ ] Caching strategies — cache-aside, write-through, write-back
- [ ] Cache invalidation patterns
- [ ] CDN basics
- [ ] Load testing concepts (k6, Artillery)
- [ ] Memory leaks — detection & prevention in Node.js
- [ ] Compression (gzip/brotli) for API responses

---

## Phase 5: Real-Time & Async Systems

- [ ] WebSockets vs Socket.io vs Server-Sent Events (SSE)
- [ ] Message queues — BullMQ, RabbitMQ, Kafka (basics)
- [ ] Pub/Sub patterns
- [ ] Idempotency in distributed operations
- [ ] Webhooks — design & verification (signatures)
- [ ] Background jobs & cron scheduling

---

## Phase 6: System Design

- [ ] Horizontal vs vertical scaling
- [ ] Load balancing algorithms (round-robin, least-connections)
- [ ] Microservices vs monolith — trade-offs
- [ ] API Gateway pattern
- [ ] Database sharding & replication (deep dive)
- [ ] CAP theorem
- [ ] Designing common systems: URL shortener, rate limiter, chat app, notification system, feed system
- [ ] CQRS & event-driven architecture basics
- [ ] Circuit breaker & retry patterns
- [ ] Service discovery basics

---

## Phase 7: Security

- [ ] CSRF, XSS, SQL/NoSQL injection — prevention techniques
- [ ] CORS — deep dive (preflight, credentials, origins)
- [ ] Password hashing (bcrypt/argon2) & salting
- [ ] HTTPS/TLS basics
- [ ] Helmet.js & security headers
- [ ] OWASP Top 10 awareness
- [ ] Secure cookie flags (httpOnly, secure, sameSite)
- [ ] Secrets rotation & API key management

---

## Phase 8: DSA (for technical rounds)

- [ ] Arrays, strings, hashmaps
- [ ] Linked lists, stacks, queues
- [ ] Trees, BST, graphs (BFS/DFS)
- [ ] Recursion & backtracking
- [ ] Sorting & searching algorithms
- [ ] Time/space complexity (Big O)
- [ ] Dynamic programming basics
- [ ] Sliding window & two-pointer patterns

---

## Phase 9: Interview Readiness

- [ ] STAR method for behavioral questions
- [ ] Explain your own projects end-to-end (auth system, real-time tracking, dev platform)
- [ ] Be ready to defend design decisions & bug-fix stories
- [ ] System design whiteboard practice
- [ ] Common HR/culture-fit questions
- [ ] "Why hire a fresher over AI-assisted output" — judgment-layer narrative

---

## Diary Split Guide

| Type                                        | Where          |
| ------------------------------------------- | -------------- |
| Concepts, definitions, trade-offs, diagrams | Physical diary |
| Code snippets, boilerplate, exact syntax    | Digital        |
| Project bug stories (STAR format)           | Physical diary |
| Links, docs references                      | Digital        |
| Mistake log (searchable)                    | Digital        |

**Tip:** Check off each topic box here as you complete it in your physical diary — this file becomes your master tracker.
