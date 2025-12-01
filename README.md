# AFH Prelander

A modern prelander page for filtering leads in the Adult Family Home (AFH) funnel. This page sits between ads and the main website, collecting qualifying information from potential leads.

## Funnel Flow

```
Ad → Prelander → Website
```

## Features

- **Multi-step Question Flow**: Progressive disclosure of questions to reduce friction
- **Lead Qualification**: Filters leads through key questions:
  - Who they're searching for (mom, dad, spouse, other)
  - Monthly budget range
  - Level of care needed
  - Location preference
  - Timeline for move-in
- **Modern UI**: Beautiful, responsive design with smooth animations
- **Progress Tracking**: Visual progress bar showing completion status
- **Auto-advance**: Automatically moves to next question after selection

## Getting Started

### Prerequisites

- Node.js 18+ and npm (or yarn)

### Installation

1. Install dependencies:
```bash
npm install
```

2. Run the development server:
```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser

### Building for Production

```bash
npm run build
npm start
```

## Configuration

### 1. Set Up Supabase Database

1. Create a Supabase project at [supabase.com](https://supabase.com)
2. Run the SQL script in `supabase-setup.sql` in your Supabase SQL Editor to create the `leads` table
3. Get your Supabase credentials from Project Settings → API

### 2. Set Up Twilio for SMS Notifications

1. Create a Twilio account at [twilio.com](https://twilio.com)
2. Get a phone number and your Account SID and Auth Token
3. Add credentials to environment variables

### 3. Configure Environment Variables

Create a `.env.local` file in the root directory:

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Twilio Configuration
TWILIO_ACCOUNT_SID=your_twilio_account_sid
TWILIO_AUTH_TOKEN=your_twilio_auth_token
TWILIO_PHONE_NUMBER=your_twilio_phone_number
```

### 4. Create Admin User

1. Go to your Supabase dashboard → Authentication → Users
2. Click "Add user" → "Create new user"
3. Enter email and password (you'll use this to log into `/admin`)

### 5. Update Redirect URL

In `app/page.tsx`, update the redirect URL in the `handleSubmit` function:

```typescript
window.location.href = `https://your-website.com/qualified-lead?${params.toString()}`
```

### 6. Install Dependencies

```bash
npm install
```

## Admin Dashboard

Access the admin dashboard at `/admin` to view all lead submissions:

- **Login**: `/admin/login`
- **Dashboard**: `/admin` (protected, requires authentication)

The dashboard shows:
- All lead submissions with contact info
- Quiz answers and responses
- Submission timestamps
- Clickable email/phone links

## SMS Notifications

When a new lead is submitted, an SMS is automatically sent to `(360) 606-7393` with:
- Lead name and email
- Budget range
- Timeline

### Customize Questions

Edit the `questions` array in `app/page.tsx` to modify or add questions.

## Project Structure

```
afhpre/
├── app/
│   ├── layout.tsx          # Root layout
│   ├── page.tsx            # Main prelander page
│   ├── page.module.css     # Page styles
│   └── globals.css         # Global styles
├── package.json
├── tsconfig.json
├── next.config.js
└── README.md
```

## Technologies

- **Next.js 14**: React framework with App Router
- **TypeScript**: Type safety
- **CSS Modules**: Scoped styling

## License

Private project

