# Platform Preview (TypeScript)

A static, interactive preview of the professional community platform with white/blue theme. Built in TypeScript.

## Develop
```
npm i
npm run build
python3 -m http.server 8080 --directory .
# open http://localhost:8080
```

## Features in preview
- Views: Home, Discovery, Brand, Analytics
- Command palette (Ctrl/Cmd+K)
- Keyboard shortcuts (1–4 to navigate, `/` to focus search)
- Compact density toggle
- Toasts, typing indicator, simulated presence
- PWA (manifest + offline caching via service worker)

## Deploy to Vercel
- Connect this folder as a project
- Build Command: `npm run build`
- Output: static (root). Ensure `index.html` is at project root
- Or use Vercel CLI:
```
npm i -g vercel
vercel deploy --prod
```

## Docker
Build and run:
```
docker build -t platform-preview .
docker run -p 8080:80 platform-preview
# open http://localhost:8080
```

## Notes
- This is a UI/UX preview; backend, auth, RTC, and search are mocked.
- Update `service-worker.js` cache version when assets change.