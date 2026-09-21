# AI Verse Chatbot: Frontend Integration Guide

This adds the "Ask AI Verse" chat button to https://aiverse.espire.com.
It is a frontend-only change: copy 3 files, paste 1 snippet, redeploy.
Time needed: about 10 minutes.

## What is in this zip

```
aiverse-chatbot-widget/
├── README.md                  <- this guide
├── snippet.html               <- the block to paste into index.html
└── chatbot/
    ├── espire-chat-widget.js  <- the chat widget (plain JavaScript, no dependencies)
    ├── espire-chat-widget.css <- its styles
    └── aiverse-logo.png       <- avatar logo used by the CSS
```

## Steps

### Step 1. Copy the `chatbot` folder into the site's static folder

Copy the whole `chatbot/` folder, as it is, into the folder whose contents are
served from the site root.

| Frontend type          | Put it here                                   |
|------------------------|-----------------------------------------------|
| Vite / React / Vue     | `public/chatbot/`                             |
| Create React App       | `public/chatbot/`                             |
| Angular                | `src/assets/` is NOT the root, so add `chatbot` to `assets` in `angular.json`, or use `public/chatbot/` (Angular 17+) |
| Plain HTML site        | `chatbot/` next to `index.html`               |

Rules:
- Keep all 3 files together in the same folder. The CSS loads the logo by relative path.
- Do not rename the files.
- Do not import them into the app bundle. They are served as static files.

Check: after a build, these 3 files must be reachable at
`/chatbot/espire-chat-widget.js`, `/chatbot/espire-chat-widget.css`, `/chatbot/aiverse-logo.png`.

### Step 2. Paste the snippet into `index.html`

Open the site's main `index.html`. Paste the contents of `snippet.html`
just before the closing `</body>` tag:

```html
<script src="/chatbot/espire-chat-widget.js?v=1"></script>
<script>
  window.EspireChatWidget.init({
    apiUrl: "https://func-aiverse-chatbot.azurewebsites.net",
    cssPath: "/chatbot/espire-chat-widget.css?v=1",
    panelTitle: "Ask AI Verse",
    panelSubtitle: "Espire AI Verse — solutions, capabilities & stories."
  });
</script>
```

Do not change `apiUrl`. It is the live chatbot API.

### Step 3. Build and deploy as usual

Use your normal build and release process. Nothing else changes.

### Step 4. Verify on the live site

1. Open https://aiverse.espire.com and hard-refresh (Ctrl+F5).
2. A round chat button appears at the bottom-right of every page.
3. Click it and ask: `What AI solutions does Espire offer?`
4. You should get a bulleted answer with numbered source chips below it, in about 3 to 10 seconds.
   (The first question after a quiet period is the slow one. Later ones take about 3 seconds.)

## If something is wrong

| What you see                                              | Cause and fix |
|-----------------------------------------------------------|---------------|
| No chat button                                            | Open `/chatbot/espire-chat-widget.js` directly in the browser. If it is a 404 or returns the app's HTML page, the folder is not in the static root (Step 1). |
| Button shows but looks unstyled                           | `/chatbot/espire-chat-widget.css` is not reachable. Same fix as above. |
| Avatar logo missing                                       | `aiverse-logo.png` is not in the same folder as the CSS. |
| Chat opens but every question gives a connection error, and the browser console shows a CORS error | The site is running on a domain the API does not allow yet. See "Allowed domains" below. |
| Browser console shows a Content-Security-Policy error     | The site sends a CSP header. Add `https://func-aiverse-chatbot.azurewebsites.net` to `connect-src`. |
| You updated the widget files but still see the old version | Bump `?v=1` to `?v=2` in both places in the snippet. |

## Allowed domains

The API only accepts calls from these sites:

- `https://aiverse.espire.com` (already allowed)

To test on a dev or staging site first, send its exact URL
(for example `https://dev-aiverse-frontend.azurewebsites.net`) to Javed Khan.
It will be added the same day. No code change is needed on your side.

## What you do NOT need to do

- No backend, database, or SSO changes.
- No API keys or secrets. The widget holds none and only calls the public `/api/chat` endpoint.
- No npm packages. The widget is plain JavaScript, builds its own elements, and all its CSS is
  scoped under `.espire-chat-root`, so it does not affect the site's styles.

## To remove it

Delete the snippet from `index.html` and redeploy. The `chatbot/` folder can then be deleted.

## Contact

Javed Khan, javed.khan@espire.com
