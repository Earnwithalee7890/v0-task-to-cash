# 🔔 Farcaster Notifications - Usage Guide

## Overview
Your TrueScore Mini App now supports push notifications! Users can receive alerts for score updates and reward claims directly on their mobile devices.

---

## 📱 Notification Types

### 1. **Check Your Score** 🎯
```
Title: "Check Your Neynar Score! 🎯"
Body: "Open and see your latest reputation score"
```

### 2. **Claim Rewards** 🎁
```
Title: "Claim Your Rewards! 🎁"  
Body: "Check in now and claim your daily rewards"
```

### 3. **Score Updated** (Auto)
```
Title: "Score Updated! 🎯"
Body: "Your Neynar score is now 89!"
```

### 4. **Achievement Unlocked** (Auto)
```
Title: "Achievement Unlocked! 🏆"
Body: "You earned: Week Warrior"
```

---

## ⏰ Automated Scheduling (NEW!)

The app now automatically sends notifications at scheduled intervals using Vercel Cron Jobs!

### **Daily Notifications (9:00 AM UTC / 2:30 PM IST)**
- **Check-In Reminder:** "Don't break your streak! 🔥"
- **Morning Neynar Boost:** "Boost Your Score! 🎯 - Follow quality users"

### **Afternoon Notification (3:00 PM UTC / 8:30 PM IST)**
- **Neynar Engagement:** "Like & Engage! 💙 - Engage with content"

### **Evening Notification (9:00 PM UTC / 2:30 AM IST)**
- **Neynar Share:** "Recast & Share! 🔄 - Share quality content"

### **Weekly Summary (Monday 10:00 AM UTC)**
- **Score Summary:** "Your Weekly Score is Ready! 📊"

> **Note:** These run automatically! No manual action required.

---

## 🚀 How to Use

### For Users:
1. Open TrueScore Mini App
2. Enable notifications when prompted
3. Receive updates automatically!

### For You (Admin):

#### **Send "Check Score" Notification:**
```bash
POST https://v0-task-to-cash-seven.vercel.app/api/notifications/send

{
  "type": "checkScore"
}
```

#### **Send "Claim Rewards" Notification:**
```bash
POST https://v0-task-to-cash-seven.vercel.app/api/notifications/send

{
  "type": "claimRewards"
}
```

#### **Send to Specific Users:**
```bash
POST https://v0-task-to-cash-seven.vercel.app/api/notifications/send

{
  "type": "checkScore",
  "fids": ["338060", "123456"]
}
```

---

## 🧪 Testing

### **Test Notification (Quick Test):**
Visit in browser:
```
https://v0-task-to-cash-seven.vercel.app/api/notifications/test?type=checkScore
```

Or:
```
https://v0-task-to-cash-seven.vercel.app/api/notifications/test?type=claimRewards
```

### **Check Status:**
```
GET https://v0-task-to-cash-seven.vercel.app/api/notifications/send
```

Response:
```json
{
  "totalUsers": 5,
  "users": [
    { "fid": "338060", "enabledAt": "2026-01-10T..." }
  ],
  "availableTypes": ["checkScore", "claimRewards", ...]
}
```

---

## 📊 API Endpoints

### 1. **Webhook (Auto)** - Receives user tokens
```
POST /api/webhook/notifications
```
- Auto-called by Farcaster when users enable/disable notifications
- Stores notification tokens automatically

### 2. **Send Notification**
```
POST /api/notifications/send
```

**Body:**
```json
{
  "type": "checkScore" | "claimRewards" | "scoreUpdated" | "achievement" | "reminder" | "custom",
  "fids": ["338060"],  // Optional - send to specific users
  "customMessage": {   // Only for type: "custom"
    "title": "Custom Title",
    "body": "Custom message"
  }
}
```

### 3. **Test Endpoint**
```
GET /api/notifications/test?type=checkScore
```

---

## 💡 Use Cases

### **Daily Reminders**
Send at 9 AM daily to remind users to check their score:
```javascript
// In your cron job or scheduled task
await fetch('https://v0-task-to-cash-seven.vercel.app/api/notifications/send', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ type: 'checkScore' })
});
```

### **Reward Campaign**
When you're running a special reward event:
```javascript
await fetch('https://v0-task-to-cash-seven.vercel.app/api/notifications/send', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ type: 'claimRewards' })
});
```

### **Score Milestone**
When a user reaches a score milestone (integrate in your app):
```javascript
if (newScore >= 90 && oldScore < 90) {
  await fetch('https://v0-task-to-cash-seven.vercel.app/api/notifications/send', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      type: 'scoreUpdated',
      newScore: 90,
      fids: [userFid]
    })
  });
}
```

---

## 🔧 Integration Examples

### **In Profile Page** (score.update):
```typescript
// When score updates
if (score > previousScore) {
  await fetch('/api/notifications/send', {
    method: 'POST',
    body: JSON.stringify({
      type: 'scoreUpdated',
      newScore: score,
      fids: [fid]
    })
  });
}
```

### **In Daily Check-In**:
```typescript
// After successful check-in
await fetch('/api/notifications/send', {
  method: 'POST',
  body: JSON.stringify({
    type: 'achievement',
    achievement: '7-Day Streak!',
    fids: [fid]
  })
});
```

---

## 📝 Notes

- **Max 100 users per request** - Farcaster API limitation
- **Title max 32 chars** - Automatically truncated
- **Body max 128 chars** - Automatically truncated
- **Tokens stored in memory** - Will reset on server restart (upgrade to database for production)

---

## 🔐 Security

- Tokens are stored securely
- Only your backend can send notifications
- Users can disable anytime
- Webhook verifies Farcaster source

---

## 🎯 Next Steps

### **Recommended:**
1. ✅ Test notifications with your account
2. ✅ Set up cron job for daily reminders
3. 🔄 Integrate with score updates 
4. 🔄 Add to achievement unlocks
5. 📊 Upgrade to database storage (Supabase)

### **Future Enhancements:**
- Rich notifications with images
- Notification history/logs
- User preference management
- Scheduled campaigns
- A/B testing for notification copy

---

**You're all set! Start sending notifications to your users! 🎉**
