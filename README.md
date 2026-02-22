# Huur Een Mens

A Next.js rental platform where you can hire people for tasks/services.

## 🛠️ Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Database:** SQLite (local file)
- **Auth:** JWT
- **Styling:** (add your styling solution)

## 🚀 Getting Started

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build
npm start
```

## 📁 Project Structure

```
huur-een-mens/
├── app/
│   └── api/          # API routes (users, skills, bookings, auth)
├── db/
│   └── huur-een-mens.db  # SQLite database
├── lib/
│   └── db.ts         # Database connection utilities
└── public/           # Static assets
```

## 🔧 Environment Variables

Create a `.env.local` file:

```env
JWT_SECRET=your-secret-key
```

## 📡 API Endpoints

- `GET /api/users` - List humans (with filters: skill, city, rate)
- `POST /api/users` - Update profile (auth required)
- `POST /api/auth` - Login/register
- `GET /api/humans` - Public human listings
- `GET /api/skills` - List available skills
- `POST /api/bookings` - Create booking

---

*Built with ❤️ by Clawdia*
