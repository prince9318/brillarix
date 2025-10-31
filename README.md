# Product Explorer

A modern Next.js application that showcases products with features like search, filtering, sorting, and theme switching.

## Features

- 🎨 Light/Dark theme support
- 🔍 Real-time search functionality
- 📑 Category filtering
- 💰 Price sorting (ascending/descending)
- 📱 Responsive design
- ⚡ Server-side rendering with Next.js 13+ App Router
- 🎯 Client-side pagination
- 🔄 ISR (Incremental Static Regeneration) for data fetching

## Tech Stack

- [Next.js](https://nextjs.org/) - React framework with App Router
- [TypeScript](https://www.typescriptlang.org/) - Type safety
- [CSS Modules](https://github.com/css-modules/css-modules) - Scoped styling
- [Fake Store API](https://fakestoreapi.com/) - Product data

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

## Project Structure

```
my-product-explorer/
├── app/                   # Next.js 13+ App Router pages
│   ├── layout.tsx        # Root layout
│   ├── page.tsx          # Home page
│   └── product/
│       └── [id]/         # Dynamic product pages
├── components/           # React components
│   ├── Filters/         # Search and filtering components
│   ├── ProductCard/     # Product card component
│   ├── ProductGrid/     # Grid layout for products
│   └── UI/              # Common UI components
├── public/              # Static assets
└── types/               # TypeScript type definitions
```

## Features in Detail

### Theme Switching

- Automatically detects system preference
- Manually toggle between light/dark themes
- Persists selection in localStorage

### Search and Filtering

- Real-time search with URL synchronization
- Category-based filtering
- Price-based sorting (low to high, high to low)

### Pagination

- Client-side implementation
- Smooth scroll to top on page change
- Responsive design for mobile

## Performance Optimization

- Server-side rendering for initial page load
- Incremental Static Regeneration for data updates
- Client-side search and filtering for instant feedback
- Suspense boundaries for improved loading states

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
