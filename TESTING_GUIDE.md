# 🧪 Testing Guide - Voting System

## ✅ All Tests Passed Successfully!

### Test Results Summary

```
✓ Database connection successful
✓ Schema created with all indexes and triggers
✓ API endpoints responding correctly
✓ Frontend loads and displays data
✓ Votes persist after page refresh
✓ Duplicate prevention working
✓ Multiple voters supported
✓ Remove votes functionality working
```

---

## 🎯 Manual Testing Steps

### Test 1: Basic Voting
1. Open http://localhost:3000 in your browser
2. Select "José" from the dropdown
3. Click "Votar" on "Playa Delfines, Cancún"
4. You should see:
   - Button changes to "✓ Votado" with blue background
   - Vote count increases to "1 🗳️"
   - "Has votado por 1 lugares" appears under your name

### Test 2: Vote Persistence
1. With José's vote from Test 1
2. **Refresh the page** (Cmd+R or F5)
3. Select "José" again from dropdown
4. You should see:
   - Your vote is still there! ✓
   - Playa Delfines still shows as voted
   - Vote count persists

### Test 3: Multiple Voters
1. Select "Lolis" from dropdown
2. Vote for "Playa Delfines, Cancún"
3. Vote count should show "2 🗳️"
4. Select "José" again
5. José's vote should still be there
6. Both votes are independent

### Test 4: Remove Vote
1. Select "José" from dropdown
2. Click on "✓ Votado" for Playa Delfines
3. You should see:
   - Button changes back to "Votar"
   - Vote count decreases
   - "Has votado por 0 lugares"

### Test 5: Duplicate Prevention
1. Select "José" from dropdown
2. Vote for "Isla Mujeres Snorkeling"
3. Try to vote again by clicking multiple times rapidly
4. Should only count as 1 vote (no duplicates)

### Test 6: Multiple Browser Windows
1. Open http://localhost:3000 in Chrome
2. Open http://localhost:3000 in Safari (or another Chrome window)
3. Vote in one browser
4. Refresh the other browser
5. Vote should appear in both! (shared database)

---

## 🔍 Database Verification

### Check votes directly in database:
```bash
psql "postgresql://neondb_owner:npg_7UgrBk5mRFzs@ep-muddy-base-adbun44p-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require" \
  -c "SELECT voter_name, place_id, created_at FROM votes ORDER BY created_at DESC;"
```

### View vote counts:
```bash
psql "postgresql://neondb_owner:npg_7UgrBk5mRFzs@ep-muddy-base-adbun44p-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require" \
  -c "SELECT place_id, COUNT(*) as votes FROM votes GROUP BY place_id ORDER BY votes DESC;"
```

---

## 🌐 API Testing

### Get all votes:
```bash
curl http://localhost:3000/api/votes | python3 -m json.tool
```

### Add a vote:
```bash
curl -X POST http://localhost:3000/api/votes \
  -H "Content-Type: application/json" \
  -d '{
    "voterName": "José",
    "placeId": "cancun__playas__playa-delfines",
    "action": "add"
  }' | python3 -m json.tool
```

### Remove a vote:
```bash
curl -X POST http://localhost:3000/api/votes \
  -H "Content-Type: application/json" \
  -d '{
    "voterName": "José",
    "placeId": "cancun__playas__playa-delfines",
    "action": "remove"
  }' | python3 -m json.tool
```

### Test duplicate (should fail):
```bash
# Add first vote
curl -X POST http://localhost:3000/api/votes \
  -H "Content-Type: application/json" \
  -d '{"voterName": "Test", "placeId": "test__place", "action": "add"}'

# Try to add same vote again (should return error)
curl -X POST http://localhost:3000/api/votes \
  -H "Content-Type: application/json" \
  -d '{"voterName": "Test", "placeId": "test__place", "action": "add"}'
```

---

## 🐛 Troubleshooting

### Issue: "Cannot GET /api/votes"
**Solution:** Restart the dev server
```bash
# Find the process
lsof -ti:3000

# Kill it
kill <PID>

# Restart
npm run dev
```

### Issue: Database connection error
**Solution:** Check DATABASE_URL in .env file
```bash
# Verify connection
psql "$DATABASE_URL" -c "SELECT 1;"
```

### Issue: Votes not persisting
**Solution:** Check browser console for errors
1. Open DevTools (F12)
2. Go to Console tab
3. Look for red error messages
4. Also check Network tab for failed API requests

### Issue: "Loading..." forever
**Solution:** API might not be responding
1. Check if server is running: `lsof -ti:3000`
2. Check API manually: `curl http://localhost:3000/api/votes`
3. Check browser Network tab for failed requests

---

## ✨ Expected Behavior

### Loading State:
- Shows wave icon with "Cargando votaciones..."
- Connects to database
- Transitions to main app

### Empty State:
- Shows all places
- No votes counted
- All buttons say "Votar"

### After Voting:
- Button changes to "✓ Votado"
- Vote count updates immediately
- Top 5 section appears when votes exist

### On Refresh:
- Shows loading briefly
- Loads all votes from database
- Your votes are preserved

### Multiple Users:
- Each voter has independent vote list
- Vote counts combine all voters
- Can see total votes per place

---

## 📊 Performance Checks

### API Response Times:
- GET /api/votes: Should be < 100ms
- POST /api/votes: Should be < 200ms

### Database Queries:
- All queries should be < 50ms (Neon is fast!)
- Indexes ensure quick lookups

### Frontend Loading:
- Initial load: < 1s
- Vote toggle: Instant (optimistic UI)
- Database save: < 300ms

---

## 🎉 Success Criteria

✅ All family members can vote independently
✅ Votes persist across page refreshes
✅ No duplicate votes possible
✅ Vote counts update in real-time
✅ Beautiful UI with loading states
✅ Error handling works properly
✅ Database connection is stable

---

**All tests passed! Your voting system is ready for production! 🚀**

