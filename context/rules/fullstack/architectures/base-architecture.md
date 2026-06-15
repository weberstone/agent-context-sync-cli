# Architecture & Design Patterns
To prevent hallucinations and "reinventing the wheel", all architectural decisions must strictly adhere to established software engineering patterns and robust fullstack practices.

## 1. Core Literature & Principles
Your solutions should be heavily inspired by the following industry-standard books:
- **"Design Patterns: Elements of Reusable Object-Oriented Software" (GoF)**: Use established creational, structural, and behavioral patterns (e.g., Factory, Strategy, Observer, Decorator) instead of custom ad-hoc structures.
- **"Clean Architecture" by Robert C. Martin**: Separate concerns. Keep business logic independent of external frameworks. Depend on abstractions, not concretions.
- **"Domain-Driven Design" (DDD) by Eric Evans**: For complex business logic, organize code around domains, aggregates, entities, and value objects.
- **"Designing Data-Intensive Applications" by Martin Kleppmann**: Design reliable, scalable, and maintainable systems with a deep understanding of data storage, distributed systems, and concurrency.

## 2. Anti-Hallucination Protocol
- **Do not invent new architectural patterns**. If a standard pattern fits the problem, use it and explicitly name it in your explanation.
- Keep the architecture as simple as possible but no simpler (KISS principle).
- Follow SOLID principles meticulously.

## 3. Fullstack-Specific Architecture
- **Type-safe boundaries**: Share types between frontend and backend via shared packages or code generation (OpenAPI, tRPC).
- **BFF pattern**: Backend-for-Frontend where appropriate — tailor API responses to UI needs without over-fetching.
- **Monorepo discipline**: Clear module boundaries, dependency graphs, and build caching.
- **SSR/SSG/CSR**: Choose the rendering strategy per-page based on data freshness and interactivity needs.

## 4. Defensive Programming & Safety
- **Strict Validation**: Assume all incoming external data (Payloads, Queries, Params) is malicious or malformed. Validate on both client and server.
- **Resilience & Fallbacks**: External services fail. Always implement timeouts, and where applicable, use Retry or Circuit Breaker patterns.
- **Global Exception Handling**: Never leak stack traces to the client. Use global error boundaries on both frontend and backend.
- **Security Guardrails**: Prevent SQL/NoSQL injections. Never log sensitive data. Apply CSP, CORS, and security headers.

## 5. Performance First
- **Bundle discipline**: Code split at route level. Lazy load everything that isn't above the fold.
- **Database Optimization**: Assume tables have millions of rows: utilize indexes, and never return unpaginated lists.
- **Caching**: Implement CDN caching for static assets, Redis for session/query cache, and HTTP cache headers.

## 6. Dependencies & Native Capabilities
- **Maximize Native APIs**: Prioritize native browser APIs and Node.js built-ins before reaching for third-party tools.
- **Strict Dependency Control**: You are STRICTLY FORBIDDEN from installing new third-party libraries without explicit user consent. Propose, justify, and wait for approval.

## 7. Directory Structure (Domain-Driven)
Group code by business capability (e.g., `modules/users`, `modules/orders`) rather than by technical roles. Shared code goes into `shared/` or `common/`.