# My NestJS API Project

```bash
$ pnpm install
```

## Compile and run the project

```bash
# development
$ pnpm run start

# watch mode
$ pnpm run start:dev

# production mode
$ pnpm run start:prod
```

## Run tests

```bash
# unit tests
$ pnpm run test

# e2e tests
$ pnpm run test:e2e

# test coverage
$ pnpm run test:cov
```

## How to run

1. Install ngrok: https://ngrok.com/download
2. Login: ngrok config add-authtoken <YOUR_TOKEN>
3. Start server: pnpm start
4. Start ngrok in another terminal: ngrok http 3000
5. Use provided ngrok URL as callback or run GET /start if code auto-generates it
6. Test endpoints (Postman / browser / curl):
   - GET /start → get part1 and callback URL
   - POST /callback → { "part2": "" }
   - GET /final → show final message

## Example output

```bash
🚀 Server started: http://localhost:3000
➡️ 1. GET /start → get first part and generate ngrok URL
➡️ 2. POST /callback → second part will be received here (automatic)
➡️ 3. GET /final → get final message
🌐 Callback URL: https://yuette-seriocomic-monnie.ngrok-free.dev/callback
📩 Callback data: { part2: '-90a9-12d2a2fcbb3f' }
✅ Second part received (part2): -90a9-12d2a2fcbb3f
✅ First part received (part1): c21af297-4584-4655
🔐 Combined code: c21af297-4584-4655-90a9-12d2a2fcbb3f
🎉 Final message: { msg: 'Hello test API!' }
