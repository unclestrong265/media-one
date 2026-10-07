# Media One Digital

Agency website built with Next.js, React and TypeScript, with a separate Laravel API foundation.

## Get started

```bash
npm ci
npm run dev
```

Open http://localhost:3000. Run `npm run build` to check TypeScript and generate the production site in `out/`.

## Folder map

| Folder | Contents |
| --- | --- |
| `app/` | Website routes, layout, components, styles and asset helpers |
| `public/` | Published website images, icons, client logos and 3D team cards |
| `api/` | Laravel API, database migrations and backend tests |
| `assets/brand/` | Original brand artwork |
| `assets/team/` | Original team portraits |
| `assets/clients/` | Client logo source images |
| `assets/icons/` | Original icon files |
| `assets/references/` | Reference imagery |
| `assets/archives/` | Supplied source archives |
| `docs/` | Development guide, technology proposal and supplied briefs |
| `.github/workflows/` | GitHub Pages build and deployment |

Source assets belong in `assets/`; assets used by the website belong in `public/`. Keep framework configuration and package files at the project root. Dependencies, build output and TypeScript caches are generated locally and ignored by Git.

## Development and deployment

See the [development guide](docs/development.md) for website behavior and local preview instructions. The [technology proposal](docs/technology-proposal.md) describes planned platform features; the [source briefs](docs/briefs/) contain the supplied content.

The website exports static files. Pushes to `main` run the GitHub Pages workflow with the `/media-one` base path. The Laravel API is a separate application and is not deployed by that workflow.

## Checkout authentication

The project is linked to the **MEDIA ONE** Clerk application (`app_3KMiXlYWNKRyVkggsq2faU8ODHi`). The CLI has pulled development keys into the ignored `.env.local`; Google sign-in and sign-up are enabled in the development instance. To refresh local keys, run `clerk env pull`. For production, configure Google OAuth credentials and the deployed site domain using [Clerk’s Google setup guide](https://clerk.com/docs/guides/configure/auth-strategies/social-connections/google).

For GitHub Pages, add `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` as a repository Actions variable and rebuild. Only the publishable key belongs in this frontend; keep secret keys on the backend.

The branded package checkout requires a Clerk session and uses the account email for payment. It preserves the selected package in the URL across OAuth redirects. Clerk’s React SDK and hash routing support the static export without Next.js middleware. Sign-in and sign-up pages are available at `/sign-in/` and `/sign-up/`, and account controls appear in the navigation. Without a publishable key, the site still builds and checkout displays a contact message.

The CLI’s generated Next.js catch-all routes cannot be exported to GitHub Pages. The app therefore uses Clerk’s React SDK with static auth pages. `docs/clerk-nextjs-server-proxy.ts.example` preserves the Next.js proxy configuration, including the `/__clerk/:path*` matcher, for a future server-hosted migration. It is a reference file and is not executed.

This integration gates the website checkout. The separate Laravel payment API currently remains public; enforcing account access at the API requires server-side verification of Clerk session tokens. Payment confirmation continues to use PayChangu verification.
