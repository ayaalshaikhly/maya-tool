# MAYA Calibration Tool

A peer-based calibration tool for design studio education. Students anonymously rate each other's design ideas on **Novelty** and **Familiarity**, and the tool plots results on a Novelty–Familiarity map relative to the **MAYA zone** (Most Advanced Yet Acceptable).

Developed by **Aya Al-Shaikhly** under the supervision of **Prof. WonJoon Chung**
School of Industrial Design, Carleton University — Fall 2026

## How It Works

1. **Instructor** creates a group session and shares a link with students
2. **Presenter** opens the link, enters their name and product details, gets a QR code
3. **Classmates** scan the QR code and rate the idea (10 items, 1–5 scale, anonymous)
4. **Results** appear instantly — scatter plot, direction recommendation, pie chart, item breakdown
5. **Instructor** reviews all data later on a password-protected review page

## Tech Stack

- **Frontend:** HTML, CSS, JavaScript (vanilla — no frameworks)
- **Backend:** Vercel Serverless Functions (Node.js)
- **Database:** Neon (PostgreSQL)
- **Hosting:** Vercel

## Project Structure

```
App/
├── public/
│   ├── index.html          # Instructor dashboard (create sessions)
│   ├── present.html        # Presenter page (QR code + live results)
│   ├── rate.html           # Student rating form
│   ├── review.html         # Professor review page
│   ├── style.css           # Shared stylesheet
│   └── qrcode.min.js       # QR code generator
├── api/
│   ├── create-group.js     # POST: create a group
│   ├── get-group.js        # GET: group info
│   ├── session.js          # POST: create presenter session
│   ├── get-session.js      # GET: session info
│   ├── rate.js             # POST: submit rating
│   ├── results.js          # GET: all ratings for a session
│   ├── groups.js           # GET: all groups with sessions
│   ├── clear-data.js       # POST: erase data (password protected)
│   └── setup-db.js         # GET: create/update database tables
├── svg/                    # UI mockups for Figma
│   ├── desktop/            # Desktop screens (1440×900)
│   ├── mobile/             # Mobile screens (390×844)
│   └── design-system.svg   # Design system components
├── vercel.json             # Vercel routing config
├── package.json
└── Instructor Guide.docx   # Professor user manual
```

## Setup

### 1. Database
Create a [Neon](https://neon.tech) project and copy the connection string.

### 2. Deploy
```bash
vercel --prod
vercel env add DATABASE_URL production
# paste the Neon connection string
vercel --prod
```

### 3. Initialize tables
Visit: `https://your-domain/api/setup-db`

## Environment Variables

| Variable | Description |
|---|---|
| `DATABASE_URL` | Neon PostgreSQL connection string |

## Live URL

https://www.ayaalshaikhly.com/Maya-tool

## License

Private — Carleton University
