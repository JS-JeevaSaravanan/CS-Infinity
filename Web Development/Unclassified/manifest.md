

## 📦 What is `manifest.json`?

`manifest.json` is a **Web App Manifest** — a JSON file that provides metadata about your web application.

It allows your app to be:

- Installed to the home screen (like native apps)
    
- Branded with a name, icon, and theme
    
- Launched in full-screen or standalone mode
    

---

## 📘 Example: `manifest.json`

```json
{
  "name": "Reputation Manager",
  "short_name": "RepMgr",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#ffffff",
  "theme_color": "#1976d2",
  "icons": [
    {
      "src": "/icons/icon-192x192.png",
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "/icons/icon-512x512.png",
      "sizes": "512x512",
      "type": "image/png"
    }
  ]
}
```

---

## 🧠 Key Fields Explained

|Field|Description|
|---|---|
|`name`|Full name of the app (shown on install prompt)|
|`short_name`|Used on home screen or task switcher|
|`start_url`|The entry point of the app when launched|
|`display`|How the app should appear: `standalone`, `fullscreen`, `minimal-ui`, `browser`|
|`background_color`|Background color for the splash screen during load|
|`theme_color`|Sets the browser's UI color (e.g., address bar on mobile)|
|`icons`|App icons in various sizes (used for install prompts, launcher icons, etc.)|

---

## ✅ Why it matters

- Enables **Add to Home Screen** on mobile devices
    
- Defines your app’s **look & feel** when "installed"
    
- Helps build **installable, native-like PWAs**
    
- Used by browsers like Chrome and Firefox for **PWA features**
    

---

## 📍 Where to place it?

Typically in the `public/` folder of your project (e.g., `public/manifest.json`), and linked in `index.html`:

```html
<link rel="manifest" href="/manifest.json" />
```

---

## 🧪 Bonus: You can test it in Chrome

1. Visit your site
    
2. Open DevTools → Application tab → Manifest
    
3. Inspect values, icons, and install behavior
    

---

## Summary

- **`manifest.json` = your web app’s identity and install settings**
    
- Core to building **Progressive Web Apps (PWAs)**
    
- Not required for all apps, but very useful if you want installable, mobile-friendly behavior
    

---

