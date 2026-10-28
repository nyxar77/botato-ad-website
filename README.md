# Botato Ads (إعلانك في فيديوهاتي)

A modern, interactive ad booking showcase for Botato's YouTube/stream video background placements, built with **Svelte 5**, **Tailwind CSS v4**, **Bits UI**, and **Bun**.

## Features

- 📺 **Interactive Studio Simulator**:
  - Live 3D perspective quad projection of your ad onto the TV screen and/or Green Screen background.
  - Custom foreground occlusion mask preserves the streamer sitting in front of the screens.
  - Real-time preview with custom image upload or handle/text input.
  - Interactive clickable screen polygons that highlight selections with animated marching ants.
- 🌐 **Automatic Language Detection & Manual Switcher**:
  - Automatically detects browser/system language (`ar`, `fr`, `en`).
  - Dropdown selector (`bits-ui` Select) for manual language override.
  - Full RTL/LTR typography with Cairo & Bricolage Grotesque.
- 💱 **Smart Currency Detection & Switcher**:
  - Detects timezone/locale (`Africa/Casablanca` or Moroccan locales) to display prices in Moroccan Dirhams (**DH** / **د.م**).
  - Defaults to Euros (**€**) for visitors from abroad.
  - Manual toggle to switch between DH and EUR at any time.
- 🎨 **Dark & Vibrant Theme**:
  - Dark mode by default with vibrant accents (Volt Green, Studio Blue, Inter Miami Pink).
  - Quick theme toggle (Dark / Light).
- 📋 **Seamless Booking & Payment**:
  - One-click copy for CIH Bank details (RIB, IBAN, SWIFT).
  - Dynamic `mailto:` link generating pre-filled order messages matching chosen spots, quantities, and totals.
- ⚡ **Bun + Nix + Vercel Ready**:
  - Nix Flake (`flake.nix`) providing `bun` and `imagemagick`.
  - Fully compatible with Vercel (`vercel.json` + `package.json`).

## Quick Start

### With Nix Flakes
```bash
nix develop
bun run dev
```

### With Bun directly
```bash
bun install
bun run dev
```

### Production Build & Type Check
```bash
bun run check
bun run build
bun run preview
```

### Deploy to Vercel
Push this repo to GitHub and import it on Vercel, or run:
```bash
vercel
```
`vercel.json` is configured to build using Bun and output to `dist`.
