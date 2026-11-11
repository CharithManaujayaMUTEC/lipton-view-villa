# Lipton View Villa – demo site

Next.js (App Router) + Tailwind. Public website, booking engine and admin dashboard.
All data is **mock data stored in the browser (localStorage)** – no backend needed for the client demo.

```
npm install
npm run dev     # http://localhost:3000
```

## Demo logins (also one-click on /login)
| Role    | Email                  | Password   |
|---------|------------------------|------------|
| Admin   | admin@liptonview.lk    | admin123   |
| Manager | manager@liptonview.lk  | manager123 |
| Guest   | guest@example.com      | guest123   |

Manager cannot open "Site Content". Admin can "Reset demo data" from the sidebar.

## Admin features
Dashboard (revenue, occupancy, arrivals) · Bookings (search, filter, create, confirm, edit, delete) ·
Rooms (CRUD, photos) · Photos & Videos (upload / URL, categories, featured) · Offers & promo codes ·
Reviews · Messages (from contact form) · Site content (hero, video, texts, contact).

## Going to production
Replace `lib/store.tsx` with API calls to a real DB (e.g. Postgres/Supabase) + real auth, and
file storage (S3/Cloudinary) for uploads. Sample images are Unsplash placeholders.
