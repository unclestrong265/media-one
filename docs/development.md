# Media One site scaffold

Run `npm install` then `npm run dev`. Open http://localhost:3000.
Run `npm run build` for a production and TypeScript check. The project uses static export, so preview the generated site with `npx serve out`. `npm start` is not compatible with this export configuration.

Next.js App Router, React, TypeScript and Lucide icons. Brand tokens live in `app/globals.css`; screens and sample content live in `app/page.tsx`.

The interface uses viewport-sized screens with desktop icon navigation and a mobile bottom bar. Hash navigation supports browser back/forward. Service/package selectors and project pagination work. Package checkout submits customer details to the Laravel API before redirecting to PayChangu.

Portfolio artwork is illustrative. Client authentication and chat are future work. The [technology proposal](technology-proposal.md) and [branded PDF](technology-proposal.pdf) remain separate from this implementation guide.

Original artwork is organized by purpose in `assets/`. Supplied PDF briefs live in `docs/briefs/`. Published assets remain in `public/` so their website URLs stay stable.

## Packages and payments

The website displays Starter (from K150,000), Growth (from K350,000), Pro (from K750,000/month) and Custom (custom quote), with the supplied inclusions. Starting prices are in Malawi kwacha and should be reviewed periodically against scope, production costs and market conditions.

Starter, Growth and Pro open a customer-details dialog and redirect to PayChangu hosted checkout. Pro charges the first month only; automatic recurring billing is not enabled. Custom requires an agreed quote. Payment confirmation checks the transaction reference, status, currency and amount on the server.

Set `NEXT_PUBLIC_API_URL` to the Laravel API base URL including `/api/v1` in the frontend environment (copy `.env.example` to `.env.local` for local use). For GitHub Pages, set the repository variable `NEXT_PUBLIC_API_URL` before building. Deploy the Laravel API separately, configure its `APP_URL` to the public HTTPS API origin and `FRONTEND_URLS` to allow the website origin, then run `php artisan migrate`.

In the API environment, set `PAYCHANGU_SECRET_KEY` and `PAYCHANGU_WEBHOOK_SECRET` from the merchant dashboard and `PAYCHANGU_FRONTEND_URL` to the website URL including any base path. Register `<API origin>/api/v1/package-payments/webhook` in PayChangu’s API & Webhooks settings. Signed notifications are verified against PayChangu before updating records, including when the customer does not return to the site. Start with sandbox credentials and test checkout before switching to live credentials. Secret keys stay on the API server and must never be placed in the static frontend.

The Standard Checkout request uses JSON with Bearer authentication, a unique transaction reference, customer first/last name and email, MWK pricing, package customization and metadata. The API reads `data.checkout_url` from the response. Success callbacks go to `/api/v1/package-payments/callback`, where the server verifies the transaction before redirecting; cancellations go to `/api/v1/package-payments/return`. Both endpoints accept GET and POST and verify the final state on the server before redirecting. A redirect claiming success or failure never determines the stored payment status. Verification failures keep the transaction available for a later check; verified failed payments are shown as unsuccessful.

Use a PayChangu test secret key for sandbox checkout; the key determines test versus live mode. No separate mode parameter is sent. Test fixtures use Mphatso Chirwa (`mphatso@example.test`) as the example customer. PayChangu sends payment receipt emails according to your merchant settings; the project does not send duplicate gateway receipts.
