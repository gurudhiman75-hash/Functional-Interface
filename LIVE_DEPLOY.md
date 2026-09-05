# Live Test Site

This app is set up to deploy to Firebase Hosting for the Firebase project `sarbedutech`.

## One-time setup

1. Install the Firebase CLI if you do not already have it:

```powershell
pnpm dlx firebase-tools login
```

2. In Firebase Console, open Authentication -> Settings -> Authorized domains.
3. Make sure your live domain is listed there after deploy:
   - `sarbedutech.web.app`
   - `sarbedutech.firebaseapp.com`
   - any custom domain you attach later

Google sign-in on the live site will fail if the deployed domain is not authorized.

## Deploy a live site

Run this from the repo root:

```powershell
pnpm run deploy:web
```

That builds the Vite app from `artifacts/examtree` and deploys the static output to Firebase Hosting.

## Share a preview URL

If you want a temporary test URL first:

```powershell
pnpm run preview:web
```

## Notes

- The hosting config is in `firebase.json`.
- Client-side routes are rewritten to `index.html`, so direct links like `/login` and `/dashboard` work.
- The app reads Firebase web config from `artifacts/examtree/.env.local` during build, so keep those values valid before deploying.
