# 수림 예약 (Soorim Reservation)

A Korean restaurant reservation management Progressive Web App (PWA).

## Overview

A single-page static web application for managing restaurant reservations,
table layouts, and customer bookings. The UI is in Korean and supports
month / week / day calendar views.

## Stack

- Pure static site: a single `index.html` file with inline CSS and JS modules
- Firebase (Firestore + Auth) loaded from CDN — used for data storage and login
- PWA features: `manifest.json` + `service-worker.js`
- Node.js 20 runtime is used only to run the local dev static file server

## Project Structure

- `index.html` — main application (markup, styles, JS modules)
- `manifest.json` — PWA manifest (configured for `/soorim/` scope)
- `service-worker.js` — offline cache for the PWA
- `icon-192.png`, `icon-512.png` — PWA icons
- `tv-main.jpg`, `tv-sub1.jpg`, `tv-sub2.jpg` — image assets
- `server.js` — minimal Node static file server used in the Replit dev environment

## Local Development

The "Start application" workflow runs `node server.js`, which serves the
project root on `0.0.0.0:5000`. The server:

- Sets `Cache-Control: no-store` so changes are visible on refresh
- Allows requests from any host (Replit preview proxies the iframe)
- Maps `/soorim/...` URLs to the same files at the root, so the manifest's
  `/soorim/` scope works locally

## Deployment

Configured as a static deployment with `publicDir = "."`.
