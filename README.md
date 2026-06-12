# DigiTathya MVP Prototype

DigiTathya is a Vite + React + TypeScript static frontend prototype for CropShield QR lifecycle intelligence and track-and-trace workflows. All data is mock and client-side.

## Stack

- Vite
- React
- TypeScript
- React Router
- Tailwind CSS

## Setup

```bash
npm install
npm run dev
```

Open the local Vite URL printed in the terminal.

## Route Map

- `/login`
- `/setup`
- `/app/dashboard`
- `/app/brand`
- `/app/products`
- `/app/products/:skuId`
- `/app/products/import`
- `/app/qr/generate`
- `/app/qr/activation`
- `/app/qr/inventory`
- `/app/qr/history`
- `/app/track`
- `/app/track/:serial`
- `/app/dispatch`
- `/app/dispatch/new`
- `/app/dispatch/:id`
- `/app/returns`
- `/app/recalls`
- `/app/recalls/new`
- `/app/recalls/:id`
- `/app/expiry`
- `/app/partners`
- `/app/partners/approvals`
- `/app/partners/new`
- `/app/partners/import`
- `/app/partners/contract-manufacturers`
- `/app/partners/:id`
- `/app/alerts`
- `/app/analytics`
- `/app/audit`
- `/app/settings`
- `/app/users`
- `/search`

## Demo Control

A floating Demo Control appears on every app screen. Use it to switch roles instantly and verify permissions for generation, approval, activation, dispatch, returns, recalls, settings, users, and master data.

## Notes

- Source of truth is `src/`.
- Visual theme tokens and shared component styles should not be restyled.
