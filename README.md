# Spending DNA 🧬
### AI-Powered Financial Personality Analyzer

Spending DNA analyzes your transaction history and builds a personalized behavioral financial profile — revealing spending patterns, habits, and insights you never knew existed.

---

## Live Demo
- **Frontend:** [spending-dna.vercel.app](https://spending-dna.vercel.app)
- **Backend API:** [spending-dna-api.onrender.com](https://spending-dna-api.onrender.com)

---

## Features

- **Spending DNA Engine** — Classifies users into 6 behavioral profiles (Impulse Spender, Night Owl, Balanced Saver, etc.)
- **Auto Categorization** — ML-powered transaction categorization (Zomato → Food & Beverage)
- **Behavioral Analytics** — Radar charts, pie charts, bar charts with spending insights
- **Financial Health Score** — Dynamic score based on spending behavior
- **AI Recommendations** — Personalized financial advice powered by Groq (Llama 3.1)
- **CSV Upload** — Bulk import transactions from bank statements
- **Anomaly Detection** — Flags unusual spending patterns

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React.js + Vite + Recharts |
| Backend API | Node.js + Express |
| ML Service | Python + Flask + pandas + scikit-learn |
| Database | MongoDB Atlas |
| Auth | JWT + bcryptjs |
| AI | Groq API (Llama 3.1 8b) |
| Deployment | Vercel (frontend) + Render (backend + ML) |

---

## Architecture
spending-dna/

├── frontend/          # React + Vite (deployed on Vercel)

├── backend/           # Node.js + Express API (deployed on Render)

└── ml-service/        # Python + Flask ML microservice (deployed on Render)

**Microservices flow:**
User → React Frontend → Node.js API → MongoDB Atlas

↘ Python ML Service (categorization + DNA analysis)

↘ Groq API (AI recommendations)

---

## Local Setup

### Prerequisites
- Node.js 18+
- Python 3.10+
- MongoDB Atlas account

### 1. Clone the repo
```bash
git clone https://github.com/yourusername/spending-dna.git
cd spending-dna
```

### 2. Backend
```bash
cd backend
npm install
```
Create `.env`:
PORT=8000

MONGO_URI=your_mongodb_uri

JWT_SECRET=your_secret

ML_SERVICE_URL=http://localhost:5001

GROQ_API_KEY=your_groq_key

```bash
npm run dev
```

### 3. ML Service
```bash
cd ml-service
python3 -m venv venv
source venv/bin/activate
pip install flask pandas numpy scikit-learn flask-cors python-dotenv
python3 app.py
```

### 4. Frontend
```bash
cd frontend
npm install
npm run dev
```

---

## Key Algorithms

- **Spending Personality Classification** — Rule-based behavioral analysis using pandas (weekend ratio, late-night ratio, category distribution, spending spikes)
- **Auto Categorization** — Keyword-based NLP categorizer with 10 categories and 80+ keywords
- **Health Score** — Weighted penalty system based on risky behavioral patterns
- **Anomaly Detection** — Statistical spike detection using mean + 2σ threshold




