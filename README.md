# Bookshelf - The Netflix of Knowledge

Production-ready Next.js app for personalized learning and book tracking.

## Stack
- Next.js App Router + TypeScript
- Tailwind CSS + shadcn/ui primitives
- NextAuth (existing credentials setup kept unchanged)
- Prisma ORM (existing schema kept unchanged)
- PostgreSQL-compatible database (Neon/Supabase supported)

## What This Build Includes
- Landing page (`/`) with startup-style positioning + CTA
- Dashboard (`/dashboard`) with stats, discovery rails, and recommendations
- Bookshelf (`/bookshelf`) with:
  - Shelves: Currently Reading / Completed / Want to Read
  - Drag-and-drop between shelves
  - Add book form
  - Search by title/author/tag
- Book detail page (`/books/[bookId]`) with:
  - Progress bar
  - Notes
  - Key highlights
- Learning paths (`/learning-paths`) with step completion tracking
- Profile (`/profile`) with:
  - Public shelf preview
  - Follow suggestions
- Public profile (`/profile/[userId]`) with follow button + public shelves
- Dark/light mode toggle
- Mobile responsive layout

## Important Constraint Kept
`prisma/schema.prisma`, NextAuth core behavior, and existing Prisma auth integration were intentionally not changed.

## API Endpoints Used/Added
- Existing:
  - `GET/PATCH /api/me`
  - `GET/POST /api/library` (extended behavior, same models)
  - `POST /api/users/[userId]/follow`
  - `GET /api/users/suggestions`
- Added:
  - `PATCH/DELETE /api/library/[entryId]`
  - `GET/POST /api/books`
  - `GET/PATCH /api/books/[bookId]`
  - `GET /api/users/[userId]/library`

## Local Setup
1. Install dependencies:
   - `npm install`
2. Configure environment variables (`.env`):
   - `DATABASE_URL`
   - `AUTH_SECRET`
   - `NEXTAUTH_URL`
3. Generate Prisma client (if needed):
   - `npx prisma generate`
4. Run app:
   - `npm run dev`

## Notes
- This implementation maps shelf behavior to existing `UserBook.status` values:
  - `reading` => Currently Reading
  - `finished` => Completed
  - `unread` => Want to Read
- Learning path completion is persisted in `localStorage` per logged-in user id.
