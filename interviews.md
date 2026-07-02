# Node.js Backend Developer — Interview Questions (Company-wise)

> Compiled for fresher/early-career backend interview prep. Use this digitally to track sources; copy key answers into your physical diary.

---

## TCS / Infosys / Wipro / Accenture / Capgemini (Service-based, Fresher Drives)

- What is the difference between `var`, `let`, and `const`?
- Explain event loop in Node.js.
- What is middleware in Express? How does `next()` work?
- Difference between SQL and NoSQL databases.
- What is REST API? Explain HTTP methods and status codes.
- Explain synchronous vs asynchronous programming in JS.
- What is a callback function? What is callback hell and how do you avoid it?
- Difference between `==` and `===`.
- What is JWT? How is authentication implemented in your project?
- Explain CRUD operations with an example.
- What is npm? Difference between `dependencies` and `devDependencies`.
- Explain your project architecture (be ready to draw it).

---

## Amazon

- Design a URL shortener / rate limiter (system design round).
- Explain event-driven architecture and how Node.js handles concurrency.
- How would you scale a Node.js application handling millions of requests?
- Explain idempotency — why does it matter in payment/order APIs?
- DSA: Arrays, strings, trees, graph BFS/DFS — leadership-principle-style behavioral questions mixed in.
- How do you handle retries and failures in distributed systems?
- Explain database sharding and replication.
- Walk through a time you found and fixed a tricky bug (STAR format).

---

## Flipkart / Myntra

- Explain Node.js internals — libuv, thread pool, event loop phases.
- Difference between clustering and worker threads in Node.js.
- How do you handle high-throughput write operations in MongoDB?
- Explain indexing strategies and when a compound index helps.
- Design a notification system / chat application.
- What is connection pooling and why does it matter?
- Explain caching strategies (cache-aside vs write-through) with Redis.
- How do you prevent race conditions in concurrent requests (e.g., inventory deduction)?

---

## Zomato / Swiggy

- Explain WebSockets vs Server-Sent Events vs polling — when would you use each?
- How would you design real-time order tracking?
- Explain message queues (BullMQ/RabbitMQ) — why use them over direct API calls?
- How do you ensure exactly-once / at-least-once processing?
- Explain database transactions and ACID properties with a real scenario (e.g., order + payment).
- How do you handle API rate limiting for abuse prevention?

---

## Paytm / Razorpay / PhonePe (Fintech)

- Explain how you'd design a secure authentication system (JWT access/refresh rotation, token reuse detection).
- What is encryption vs hashing? Where do you use each?
- Explain OWASP Top 10 — pick 3 and explain mitigation.
- How do you prevent double-spending / duplicate transactions (idempotency keys)?
- Explain CSRF and XSS — how does Express/Helmet help mitigate them?
- Walk through your JWT refresh token rotation implementation in detail.
- How do you securely store and manage secrets/env variables in production?

---

## Startups (Series A–C, Product-based, common general round)

- Walk me through a project you built end-to-end — what broke, how did you debug it?
- Why did you choose MongoDB/Mongoose over SQL for this project (or vice versa)?
- Explain a bug you fixed that taught you something important (e.g., TTL index issue, save-order bug).
- How do you decide between building something yourself vs using an existing library?
- "AI can write code now — why should we hire a fresher?" (judgment-layer angle: knowing _what_ to build, _why_, and catching when AI output is wrong)
- Explain your Socket.io online/offline tracking implementation — how do you handle reconnects?
- How would you redesign this if traffic grew 100x?

---

## TCS / Infosys / Wipro / Accenture / Capgemini — Round 2 (More Questions)

- What is the difference between `null` and `undefined`?
- Explain promises vs callbacks vs async/await — why did JS move toward async/await?
- What is the purpose of `package.json` and `package-lock.json`?
- Explain the difference between `PUT` and `PATCH`.
- What happens when you run `node app.js` — explain step by step.
- Difference between authentication and authorization.
- What is middleware chaining? Write a custom logger middleware.
- Explain try-catch with async/await — what happens if you forget it?
- What is the difference between monolithic and microservices architecture?
- Explain how you'd structure folders in an Express project (MVC pattern).
- What is an environment variable and why not hardcode secrets?
- Explain one-to-many and many-to-many relationships with examples.

---

## Google / Microsoft (Product-based, Higher Bar)

- Explain how V8 compiles and optimizes JavaScript (JIT compilation, hidden classes).
- Design a distributed rate limiter that works across multiple servers.
- How would you design a system to handle 1 million concurrent WebSocket connections?
- Explain consistent hashing and where you'd use it.
- What are the trade-offs between strong consistency and eventual consistency?
- Walk through how you'd debug a memory leak in a running Node.js production process.
- Explain backpressure in streams — how do you handle a slow consumer?
- DSA: medium-hard array/graph/DP problems, optimize for time and space.
- Explain how garbage collection impacts performance under heavy load.

---

## Uber / Ola

- Design a real-time location tracking system (driver-rider matching).
- How would you handle geo-spatial queries efficiently? (MongoDB geospatial indexes)
- Explain how you'd design surge pricing computation at scale.
- How do you ensure consistency when two services update the same booking simultaneously?
- Explain event sourcing — would it help in a ride-booking system?
- How do you handle service-to-service communication failures (timeouts, retries, circuit breakers)?

---

## Atlassian / Freshworks / Zoho (SaaS Product Companies)

- Explain multi-tenancy — how would you design a database for a multi-tenant SaaS app?
- How do you implement soft delete vs hard delete, and what are the trade-offs?
- Explain webhook retry mechanisms with exponential backoff.
- How would you design role-based permissions for a team collaboration tool?
- Explain optimistic vs pessimistic locking with an example.
- How do you version your REST APIs without breaking existing clients?
- Explain your approach to writing unit tests vs integration tests for an Express API.

---

## Cred / Groww / Zerodha (Fintech/Trading)

- How would you ensure no duplicate orders are placed if a user double-clicks "Buy"?
- Explain how you'd design a wallet/ledger system (double-entry bookkeeping basics).
- What is eventual consistency and why might it be risky in financial transactions?
- Explain database transaction isolation levels — which would you pick for fund transfers and why?
- How do you handle high-frequency read/write contention on a single document/row?
- Explain audit logging — how would you make financial logs tamper-evident?

---

## Common Across All Companies (Core Backend Fundamentals)

- Explain the request lifecycle in Express from request to response.
- Difference between `process.nextTick()`, `setImmediate()`, and `setTimeout()`.
- How does Node.js handle multiple concurrent requests despite being single-threaded?
- Explain horizontal vs vertical scaling.
- What is CORS and why does the browser enforce it?
- Explain password hashing — why bcrypt/argon2 over MD5/SHA alone (salting).
- What is the N+1 query problem and how do you fix it?
- Explain microservices vs monolith — trade-offs for a small team.
- How do you handle environment-specific configuration (dev/staging/prod)?
- Explain logging strategy in production (why Winston/Pino, log levels, structured logs).

---

## How to Use This

| Section                                      | Diary Type                            |
| -------------------------------------------- | ------------------------------------- |
| Theory answers (event loop, JWT, ACID, etc.) | Physical — write in your own words    |
| Your project walkthroughs / bug stories      | Physical — STAR format                |
| Code snippets, exact syntax                  | Digital                               |
| Company-specific question bank (this file)   | Digital — update after each interview |

**Tip:** After every interview, add a new section here: `## Company Name — Actual Questions Asked (Date)` so this becomes a living, growing reference.
