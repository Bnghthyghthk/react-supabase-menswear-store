# Frontend Guideline Document

This document outlines the frontend setup, architecture, design principles, and technologies used in the **react-supabase-menswear-store** starter template. It is written in plain language to ensure anyone—technical or not—can understand how the frontend is organized, styled, and maintained.

## 1. Frontend Architecture

**Overview**
- We use **React** as our UI library, powered by **Vite** for fast builds and hot reloading. React gives us a component-based structure, and Vite keeps the developer experience snappy.
- The UI components come from **shadcn/ui**, a collection of accessible, customizable React primitives.
- We manage server data with **TanStack Query** (formerly React Query) and forms with **React Hook Form**. Validation is handled by **Zod** schemas.
- Animations are built with **Framer Motion**.
- All code is written in **TypeScript** for strong typing and fewer runtime errors.

**How It Supports Scalability, Maintainability, and Performance**
- **Component-based structure** makes it easy to add, remove, or refactor features without touching unrelated code.
- **Utility-first styling** (Tailwind CSS) ensures consistent design without scattered CSS files.
- **Centralized data layer** (TanStack Query + API utilities) isolates backend logic, so swapping Supabase for a MongoDB API is just a few lines of code.
- **Vite**’s lightning-fast bundling and tree-shaking keep final bundles small and load times quick.

## 2. Design Principles

We follow these core principles to guide our UI and UX decisions:

1. **Usability**: Simple, predictable flows—users know what to do at every step (e.g., clear “Add to Cart” and “Add Product” buttons).
2. **Accessibility**: All components include proper ARIA attributes and keyboard support. We rely on shadcn/ui’s built-in focus management and contrast checks.
3. **Responsiveness**: Mobile-first layouts with Tailwind’s responsive utilities ensure the site works on any device.
4. **Consistency**: A unified color palette, typography, and spacing system helps users move between the storefront and the admin panel without confusion.
5. **Performance**: Lazy loading for routes and components ensures the initial page is fast, while background prefetching keeps subsequent views instant.

**Applying These Principles**
- Buttons and forms have clear labels and error messages.
- Tables and dialogs are keyboard-navigable.
- Breakpoints at `sm`, `md`, `lg`, and `xl` adapt layouts fluidly.

## 3. Styling and Theming

**Styling Approach**
- We use **Tailwind CSS** for utility-first styling. This avoids writing custom CSS and keeps styles co-located with markup.
- No BEM or SMACSS; instead, class names like `flex`, `px-4`, `text-gray-700` describe exactly what each element looks like.

**Theming**
- Theme tokens (colors, spacing, fonts) live in `tailwind.config.ts`.
- You can switch between light and dark modes using the `dark` class on the `<html>` element.

**Visual Style**
- A **modern flat design** with subtle **glassmorphism** accents (semi-transparent cards and overlays) for a polished look.
- Subtle shadows (`shadow-md`) create depth without heavy skeuomorphism.

**Color Palette**
- Primary: `#3B82F6` (Blue 500)
- Secondary: `#10B981` (Green 500)
- Neutral Light: `#F3F4F6` (Gray 100)
- Neutral Dark: `#1F2937` (Gray 800)
- Accent: `#EF4444` (Red 500)

**Typography**
- Font Family: **Inter**, a clean and highly legible sans-serif.
- Headings: weight 600–700, scale from `2xl` down to `xl` for subsection titles.
- Body text: weight 400, size `base` (1rem).

## 4. Component Structure

**Organization**
- `src/components/ui/`: Library of primitive UI components (Button, Card, Table, Dialog, Sidebar).
- `src/features/`: Feature-specific folders (e.g., `dashboard`, `store`) that compose primitives into pages.
- `src/hooks/`: Custom reusable hooks (e.g., `useToast`, `useAuth`).
- `src/lib/`: Utility functions (e.g., `api.ts` for network calls, `cn.ts` for class merging).

**Reusability**
- Primitives are style-agnostic and take props like `className`, so you can combine them in thousands of ways.
- Higher-level components in `features` bind multiple primitives into complete patterns (e.g., `ProductTable` + `Pagination` + `Filters`).

**Benefits**
- Easy to reason about: Each file has a single responsibility.
- Fast onboarding: New team members find UI components and patterns in predictable places.

## 5. State Management

**Server State**
- Handled by **TanStack Query**.
    - `useQuery` loads data and caches it. Background refetch keeps data fresh.
    - `useMutation` updates or deletes data, with automatic cache invalidation.

**Client State**
- Local UI state (e.g., modal open/close) lives within React component state (`useState`), Context API, or Zustand if it grows.

**Shared State**
- We use React’s **Context API** sparingly for cross-cutting concerns like theme or auth.
- Most state lives in TanStack Query’s cache or in feature-local state.

## 6. Routing and Navigation

**Library**
- **React Router DOM** for declarative, nested routing.

**Structure**
- Public routes: `/`, `/products/:id`, `/cart`, etc.
- Protected admin routes: `/admin`, `/admin/products`, `/admin/orders`, only accessible after login.

**Implementation**
- Lazy-load page components with `React.lazy` and `Suspense`.
- Route definitions in `src/App.tsx` or a dedicated `src/routes.tsx` file.
- Navigation via a `<Sidebar>` component in the dashboard and a `<Header>` + `<Nav>` in the storefront.

## 7. Performance Optimization

- **Code Splitting**: Lazy-load heavy pages (e.g., admin dashboard) to keep initial bundle small.
- **Asset Optimization**: SVG icons and images are compressed; we use `vite-imagetools` or similar to auto-optimize on build.
- **Lazy Loading**: Use `loading="lazy"` on `<img>` tags and React’s `lazy()` for components.
- **Prefetching**: Preload data for expected next pages (e.g., prefetch product details on hover).
- **Caching**: TanStack Query’s stale-while-revalidate pattern minimizes network requests.

## 8. Testing and Quality Assurance

**Unit & Integration Tests**
- **Vitest** for fast unit tests of components and utilities.
- **React Testing Library** for integration tests (rendering components with mocked data and asserting behavior).

**End-to-End Tests**
- **Cypress** (or Playwright) for E2E tests covering critical flows: login, product management, checkout.

**Linters & Formatters**
- **ESLint** with the recommended React and TypeScript rules.
- **Prettier** for consistent code formatting.

**CI/CD Integration**
- Run lint, type checks, and tests on each pull request to catch errors early.

## 9. Conclusion and Overall Frontend Summary

This frontend setup provides a solid, scalable foundation for both a public menswear storefront and a private admin dashboard. By combining:

- React + Vite for fast development
- Tailwind CSS + shadcn/ui for consistent, accessible UI
- TypeScript + Zod for type-safe code and validation
- TanStack Query for declarative data fetching
- React Router for smooth navigation
- Framer Motion for polished animations

—you get a professional, high-performance application right out of the box. The clear project structure, coupled with robust testing and performance optimizations, ensures that your team can build, iterate, and maintain the menswear store confidently and efficiently.