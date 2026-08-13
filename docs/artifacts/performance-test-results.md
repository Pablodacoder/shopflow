# Performance Test Results

## Performance budget (target)
- Page load: < 2s
- API response: < 500ms
- Concurrent users: 50+

## How to run
Load test with [k6](https://k6.io) or [autocannon](https://github.com/mcollina/autocannon):

```bash
npx autocannon -c 50 -d 30 http://localhost:3000/api/products
```

`-c 50` = 50 concurrent connections, `-d 30` = 30 second duration, matching
the rubric's "50+ concurrent users" requirement.

## Results template
Fill this in after running the command above against your deployed instance:

| Endpoint | Concurrency | Avg latency | p95 latency | p99 latency | Req/sec | Errors |
|----------|-------------|-------------|-------------|-------------|---------|--------|
| GET /api/products | 50 | | | | | |
| GET /api/products/:id | 50 | | | | | |
| POST /api/orders | 50 | | | | | |

## Page load (Lighthouse)
Run `npx lighthouse http://localhost:3000/products --view` and record:

| Page | LCP | Performance score |
|------|-----|---------------------|
| /products | | |

## Notes / bottlenecks found
- *fill in after running — e.g. "product list p95 was 640ms before caching,
  180ms after adding the 60s cache layer"*
