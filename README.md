# A little world made for Yani

A mobile-first continuous one-page website with the supplied video-call screenshot, five tap-to-reveal notes, and a two-way push-notification starter.

## Run locally

1. Install Node.js 18 or newer.
2. In this folder run `npm install` then `npm start`.
3. Open `http://localhost:3000` to preview the page. Push notifications require HTTPS and will not work on ordinary local HTTP (except localhost for some browser APIs).

## Enable real iPhone push notifications

The site needs to be deployed at an HTTPS address. On iPhone, each person must open the site in Safari, choose **Share → Add to Home Screen**, open the installed icon, and tap **Enable notifications on this iPhone**. Both phones must do this.

Generate VAPID keys with:

```bash
npx web-push generate-vapid-keys
```

Set these environment variables on the hosting service:

- `VAPID_PUBLIC_KEY` = generated public key
- `VAPID_PRIVATE_KEY` = generated private key
- `VAPID_SUBJECT` = `mailto:you@example.com` (replace with a contact email)
- `PORT` = hosting provider's assigned port, if required

Then deploy the folder with `npm install` and `npm start` as the start command.

## Important limitations before sharing

- The included server keeps push subscriptions in memory, so they are lost if the server restarts. Use persistent storage (for example, a database) before relying on it long-term.
- This starter sends to every registered device except the device that tapped the button. It is intended for the two of you; add authentication/private invite access before making the site public.
- The browser must have notification permission. On iPhone, Web Push requires iOS/iPadOS 16.4+ and the website to be installed on the Home Screen.
- The five love notes are editable starter wording. Change them in `public/index.html` to make them more personal.
