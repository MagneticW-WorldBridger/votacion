# 🗳️ Voting System Database Setup

## ✅ What We Built

A **fully persistent, real-time voting system** for your family vacation planning app, connected to a **Neon PostgreSQL database**.

---

## 📊 Database Schema

### `votes` Table
```sql
CREATE TABLE votes (
  id SERIAL PRIMARY KEY,
  voter_name VARCHAR(100) NOT NULL,
  place_id VARCHAR(255) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(voter_name, place_id)  -- Prevents duplicate votes
);
```

### Indexes (for fast queries)
- `idx_votes_voter_name` - Fast lookup by voter
- `idx_votes_place_id` - Fast lookup by place
- `idx_votes_created_at` - Fast sorting by date

### Auto-Update Trigger
- `update_votes_updated_at` - Automatically updates `updated_at` on every change

---

## 🔌 API Endpoints

### GET `/api/votes`
Fetches all votes grouped by voter and vote counts per place.

**Response:**
```json
{
  "success": true,
  "votes": {
    "José": ["cancun__playas__playa-delfines", "..."],
    "Lolis": ["cozumel__buceo__palancar-reef"]
  },
  "counts": {
    "cancun__playas__playa-delfines": 5,
    "cozumel__buceo__palancar-reef": 3
  }
}
```

### POST `/api/votes`
Adds or removes a vote.

**Request:**
```json
{
  "voterName": "José",
  "placeId": "cancun__playas__playa-delfines",
  "action": "add" // or "remove"
}
```

**Response:**
```json
{
  "success": true,
  "action": "added",
  "vote": { "id": 1, "voter_name": "José", "place_id": "...", ... }
}
```

---

## 🎯 Features

✅ **Persistent Storage** - Votes survive page refreshes and browser restarts
✅ **Real-time Updates** - All family members see the same data
✅ **Duplicate Prevention** - Each person can only vote once per place
✅ **Fast Queries** - Optimized with indexes for instant response
✅ **Loading States** - Beautiful loading animations while fetching data
✅ **Error Handling** - User-friendly error messages
✅ **Optimistic Updates** - UI updates instantly for better UX

---

## 🧪 How to Test

### 1. Via Web Browser
1. Start the dev server: `npm run dev`
2. Open http://localhost:3000
3. Select your name
4. Click "Votar" on any place
5. Refresh the page - your votes persist! 🎉

### 2. Via Database (psql)
```bash
# Connect to database
psql "postgresql://neondb_owner:npg_7UgrBk5mRFzs@ep-muddy-base-adbun44p-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require"

# View all votes
SELECT * FROM votes ORDER BY created_at DESC;

# Count votes per place
SELECT place_id, COUNT(*) as vote_count 
FROM votes 
GROUP BY place_id 
ORDER BY vote_count DESC;

# Count votes per person
SELECT voter_name, COUNT(*) as vote_count 
FROM votes 
GROUP BY voter_name 
ORDER BY voter_name;
```

### 3. Via API (curl)
```bash
# Get all votes
curl http://localhost:3000/api/votes

# Add a vote
curl -X POST http://localhost:3000/api/votes \
  -H "Content-Type: application/json" \
  -d '{
    "voterName": "José",
    "placeId": "cancun__playas__playa-delfines",
    "action": "add"
  }'

# Remove a vote
curl -X POST http://localhost:3000/api/votes \
  -H "Content-Type: application/json" \
  -d '{
    "voterName": "José",
    "placeId": "cancun__playas__playa-delfines",
    "action": "remove"
  }'
```

---

## 📦 Dependencies Added

```json
{
  "@neondatabase/serverless": "^0.x.x"  // Neon PostgreSQL driver
}
```

---

## 🗂️ Files Created/Modified

### New Files:
- `src/lib/db.ts` - Database connection and queries
- `src/app/api/votes/route.ts` - API endpoints for voting
- `DATABASE_SETUP.md` - This documentation

### Modified Files:
- `src/app/vote-enhanced.js` - Updated to use database API
- `.env` - Contains database credentials (already existed)

---

## 🚀 Deployment Notes

When deploying to production (Vercel, etc.):

1. **Environment Variables**: Make sure `DATABASE_URL` is set in your hosting platform
2. **Database Connection**: Neon serverless driver works perfectly on Vercel Edge Functions
3. **No Migration Needed**: Schema already created in production database

---

## 🎨 UI Improvements

- **Loading State**: Beautiful wave animation while fetching votes
- **Voting Feedback**: "Guardando..." spinner when saving votes
- **Disabled State**: Prevents double-clicking during save
- **Error Messages**: User-friendly alerts for any issues

---

## 🔐 Security Notes

- Database credentials in `.env` should NEVER be committed to git
- Add `.env` to `.gitignore` (should already be there)
- Use environment variables in production
- The UNIQUE constraint prevents vote manipulation

---

## 🎉 What's Next?

Possible enhancements:
- [ ] Real-time sync with WebSockets
- [ ] Vote history and analytics dashboard
- [ ] Export votes to CSV/PDF
- [ ] Vote comments/reasons
- [ ] Vote deadlines
- [ ] Admin panel for managing voters

---

**Built with ❤️ using Next.js 15, Neon PostgreSQL, and TypeScript**

