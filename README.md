# Architectos

Architectos is a Next.js canvas workspace starter. The app is organized under `src/` with dedicated folders for the App Router, canvas components, UI controls, canvas math/engine utilities, stores, and hooks.

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `src/app/page.tsx`. The page auto-updates as you edit the file.

## Structure

```text
src/
  app/
  components/
    Canvas/
    Toolbar/
    UI/
  hooks/
  lib/
    canvas/
    store/
public/
  icons/
```

## Notes

This project uses Tailwind CSS v4 through `postcss.config.mjs`, which is the setup shown in the installed Next.js 16 docs.

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
