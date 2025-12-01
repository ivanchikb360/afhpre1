# Twilio Setup Guide

Follow these steps to set up Twilio SMS notifications for your prelander.

## Step 1: Create a Twilio Account

1. Go to [twilio.com](https://www.twilio.com)
2. Click **"Sign up"** (or **"Log in"** if you have an account)
3. Fill in your information and verify your email/phone

## Step 2: Get Your Account Credentials

1. After logging in, you'll land on the **Twilio Console Dashboard**
2. Look at the top of the page - you'll see:

   - **Account SID** (starts with `AC...`)
   - **Auth Token** (click the 👁️ eye icon to reveal it)

   **OR** go to:

   - Click your account name (top right) → **Account** → **General**
   - You'll see:
     - **Account SID**: `ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`
     - **Auth Token**: Click "Show" or the eye icon to reveal

⚠️ **Important**: The Auth Token is hidden by default - you need to click to reveal it!

## Step 3: Get a Phone Number

1. In Twilio Console, go to **Phone Numbers** → **Manage** → **Buy a number**
   - Or click: [console.twilio.com/us1/develop/phone-numbers/manage](https://console.twilio.com/us1/develop/phone-numbers/manage)
2. Click **"Buy a number"**
3. Select:
   - **Country**: United States (or your country)
   - **Capabilities**: Check **SMS** (and Voice if needed)
4. Click **"Search"**
5. Choose a number and click **"Buy"**
6. Confirm the purchase

You now have a Twilio phone number! (e.g., `+1234567890`)

## Step 4: Add Credentials to Environment Variables

Add these to your `.env.local` file:

```bash
TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_AUTH_TOKEN=your_auth_token_here
TWILIO_PHONE_NUMBER=+1234567890
```

**Example:**

```bash
TWILIO_ACCOUNT_SID=ACa1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6
TWILIO_AUTH_TOKEN=abc123def456ghi789jkl012mno345pqr678
TWILIO_PHONE_NUMBER=+15551234567
```

## Step 5: Update the Recipient Phone Number

The SMS will be sent to `(360) 606-7393` by default. To change this:

1. Open `lib/sms.ts`
2. Find the line with `sendSMS("+13606067393", ...)`
3. Change the phone number to your desired recipient
4. Format: `+1` + area code + number (e.g., `+13606067393`)

## Step 6: Test It

1. Restart your dev server:

   ```bash
   npm run dev
   ```

2. Submit a test lead on your prelander
3. Check the phone number you configured - you should receive an SMS!

## Troubleshooting

### "Auth Token not found"

- Make sure you clicked the **eye icon** 👁️ to reveal it
- It's in: **Account** → **General** → **Auth Token** → Click "Show"
- Copy the entire token (it's long!)

### "Invalid phone number format"

- Use format: `+1` + 10-digit number
- Example: `+15551234567` (not `555-123-4567` or `(555) 123-4567`)
- Include country code (`+1` for US)

### "SMS not sending"

- Check Twilio Console → **Monitor** → **Logs** → **Messaging** for errors
- Verify your phone number is verified (for trial accounts)
- Make sure you have credits in your Twilio account
- Check server console logs for error messages

### Trial Account Limitations

- **Trial accounts** can only send SMS to **verified phone numbers**
- To verify a number: Twilio Console → **Phone Numbers** → **Verified Caller IDs** → **Add a new Caller ID**
- Enter the phone number and verify via call or SMS code

### Upgrade to Full Account

- To send SMS to any number, upgrade your account
- Go to: **Account** → **Upgrade**
- Add payment method (you'll only pay for what you use)

## Where to Find Everything

### Account SID & Auth Token

- **Location**: Twilio Console → **Account** → **General**
- **URL**: [console.twilio.com/us1/account/settings](https://console.twilio.com/us1/account/settings)
- **Auth Token**: Click the eye icon 👁️ to reveal

### Phone Number

- **Location**: Twilio Console → **Phone Numbers** → **Manage**
- **URL**: [console.twilio.com/us1/develop/phone-numbers/manage](https://console.twilio.com/us1/develop/phone-numbers/manage)

### SMS Logs (for debugging)

- **Location**: Twilio Console → **Monitor** → **Logs** → **Messaging**
- **URL**: [console.twilio.com/us1/monitor/logs/messaging](https://console.twilio.com/us1/monitor/logs/messaging)

## Quick Reference

| What             | Where to Find                                    |
| ---------------- | ------------------------------------------------ |
| **Account SID**  | Console → Account → General (top of page)        |
| **Auth Token**   | Console → Account → General → Click 👁️ to reveal |
| **Phone Number** | Console → Phone Numbers → Manage                 |
| **SMS Logs**     | Console → Monitor → Logs → Messaging             |

## Security Notes

- ⚠️ **Never commit** your Auth Token to git (it's in `.env.local` which is gitignored)
- ✅ **Auth Token** is secret - treat it like a password
- ✅ **Account SID** is less sensitive but still shouldn't be public
- ✅ Use environment variables (never hardcode in your code)

## Production Deployment

When deploying to Vercel/Netlify, add the same three Twilio variables to your platform's environment variables:

- `TWILIO_ACCOUNT_SID`
- `TWILIO_AUTH_TOKEN`
- `TWILIO_PHONE_NUMBER`

Same values as your `.env.local` file!
