# The Archive

> A high-fidelity, minimalist music player with vinyl physics and a smart recommendation engine.

![The Archive Banner](public/pwa-512x512.png)

## 🚀 Live Demo
**[Launch The Archive](https://biplavbarua.github.io/the-archive/)**

Tap "Share" -> "Add to Home Screen" on iOS/Android for the full App experience.

## ✨ Features

- **Vinyl Physics**: Interactive record player with 1:1 touch dragging and scratch physics.
- **Auto-Radio**: Smart recommendation engine that generates an infinite "Up Next" queue based on the current track (via YouTube Data API).
- **Hybrid Source**: Direct YouTube playback with a custom audio engine.
- **PWA Ready**: Installable on mobile devices with native-like performance and splash screens.
- **Neon 80s UI**: A retro-futuristic aesthetic with glowing controls and metallic finishes.

## 🛠️ Tech Stack

- **Framework**: React + TypeScript + Vite
- **Styling**: Tailwind CSS
- **State**: Zustand (Local Storage persistence)
- **Audio**: YouTube IFrame API + Web Audio API
- **Icons**: Lucide React

## 📦 Getting Started

1. **Clone the repository**
   ```bash
   git clone https://github.com/biplavbarua/the-archive.git
   cd the-archive
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Configuration**
   - Click the **Gear Icon** in the player.
   - Enter your **YouTube Data API Key** to enable search and recommendations.

## 📱 Mobile Deployment

### Recommended: Vercel (Future-Proof)
For the best experience (automatic HTTPS, Global CDN, Pull Request Previews), we recommend Vercel.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fbiplavbarua%2Fthe-archive)

### Alternative: GitHub Pages
This project is also configured for **GitHub Pages**.

```bash
npm run deploy
```

## 📄 License

MIT
