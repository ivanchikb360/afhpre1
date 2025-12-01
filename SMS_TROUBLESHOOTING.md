# SMS Troubleshooting Guide

If you're not receiving SMS messages, follow these steps:

## Step 1: Check Server Logs

After submitting a lead, check your terminal/console where `npm run dev` is running. You should see:

**If working:**

```
📱 Attempting to send SMS notification...
Attempting to send SMS: { from: '+18445247702', to: '+13606067393', ... }
✅ SMS sent successfully to +13606067393
Twilio message SID: SMxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

**If failing, you'll see:**

```
❌ Error sending SMS: [error details]
```

## Step 2: Common Issues & Fixes

### Issue 1: "Twilio credentials not configured"

**Fix:** Make sure `.env.local` has all three variables and restart your dev server:

```bash
# Stop server (Ctrl+C), then:
npm run dev
```

### Issue 2: "The number +13606067393 is unverified"

**This is the most common issue!**

**Fix:** Verify the number in Twilio:

1. Go to: https://console.twilio.com/us1/develop/phone-numbers/manage/verified
2. Click "Add a new Caller ID"
3. Enter: `+13606067393` (or `3606067393`)
4. Choose "Text me" or "Call me"
5. Enter the verification code
6. Try submitting a lead again

### Issue 3: "Trial account restrictions"

**Fix:** Twilio trial accounts can ONLY send to verified numbers. Either:

- Verify the number (see Issue 2), OR
- Upgrade your Twilio account (add payment method)

### Issue 4: "Invalid 'To' Phone Number"

**Fix:** Check the phone number format:

- ✅ Correct: `+13606067393`
- ❌ Wrong: `3606067393` (missing +1)
- ❌ Wrong: `(360) 606-7393` (has formatting)

### Issue 5: "Invalid 'From' Phone Number"

**Fix:** Check your Twilio phone number in `.env.local`:

- Should be: `TWILIO_PHONE_NUMBER=+18445247702`
- Make sure it starts with `+1`
- Verify this number exists in: Twilio Console → Phone Numbers → Manage

### Issue 6: "Authentication failed"

**Fix:** Check your credentials:

- Account SID should start with `AC...`
- Auth Token should be revealed (click eye icon in Twilio)
- Make sure there are no extra spaces in `.env.local`

## Step 3: Check Twilio Console Logs

1. Go to: https://console.twilio.com/us1/monitor/logs/messaging
2. Look for recent message attempts
3. Click on a failed message to see the error details

Common errors you might see:

- **21608**: Unverified number (verify the number)
- **21211**: Invalid 'To' number (check format)
- **21408**: Permission denied (verify number or upgrade account)

## Step 4: Test Directly

You can test if Twilio is working by checking your Twilio account:

1. **Check balance**: Twilio Console → Account → Usage
2. **Check phone number**: Twilio Console → Phone Numbers → Manage (make sure +18445247702 is active)
3. **Check verified numbers**: Twilio Console → Phone Numbers → Verified Caller IDs

## Step 5: Quick Test Script

Create a test file to verify Twilio is working:

```bash
# Create test-sms.js in project root
```

Then run:

```bash
node test-sms.js
```

(We can create this if needed)

## Most Likely Issue

**90% of the time**, it's because `+13606067393` is not verified in your Twilio account.

**Quick fix:**

1. Go to: https://console.twilio.com/us1/develop/phone-numbers/manage/verified
2. Verify `+13606067393`
3. Submit another test lead
4. Check your phone!

## Still Not Working?

Check these in order:

1. ✅ Server logs show what error?
2. ✅ Is the number verified in Twilio?
3. ✅ Are you on a trial account? (check Twilio dashboard)
4. ✅ Check Twilio logs: https://console.twilio.com/us1/monitor/logs/messaging
5. ✅ Did you restart the dev server after adding `.env.local`?

Let me know what the server logs say and we can fix it!
