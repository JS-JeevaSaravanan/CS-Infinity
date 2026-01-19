# result-pattern

To install dependencies:

```bash
bun install
```

To run:

```bash
bun run index.ts
```


endpoint trigger:
```curl
curl -X POST http://localhost:3000/exception-price \
  -d '{"productId":1,"customerId":1}'
```
```curl
curl -X POST http://localhost:3000/result-price \
  -d '{"productId":1,"customerId":1}'
```
