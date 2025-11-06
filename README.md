Install ngrok: https://ngrok.com/download

Login: ngrok config add-authtoken <YOUR_TOKEN>

Start server: pnpm start

Start ngrok in another terminal: ngrok http 3000

Use provided ngrok URL as callback or run GET /start if code auto-generates it

Test endpoints (Postman / browser / curl):

GET /start → oladi part1 va callback URL

POST /callback → { "part2": "<received-part2>" }

GET /final → yakuniy xabarni ko‘rsatadi
