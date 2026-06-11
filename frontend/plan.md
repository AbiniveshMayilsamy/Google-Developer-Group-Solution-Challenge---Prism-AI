# 🔍 PRISM AI — Unbiased AI Decision Platform

<div align="center">

![PRISM AI Banner](https://img.shields.io/badge/PRISM%20AI-Fairness%20%26%20Ethics%20Platform-6C63FF?style=for-the-badge&logo=google&logoColor=white)

**Detect. Explain. Mitigate. Deploy with Confidence.**

[![Live MVP](https://img.shields.io/badge/🚀%20Live%20MVP-Vercel-black?style=for-the-badge)](https://google-developer-group-solution-cha.vercel.app/)
[![Demo Video](https://img.shields.io/badge/▶%20Demo%20Video-YouTube-red?style=for-the-badge)](https://youtu.be/THLu6eF83dI?si=XJ7ad1A4A2wikdgH)
[![GitHub Repo](https://img.shields.io/badge/📁%20Source%20Code-GitHub-181717?style=for-the-badge)](https://github.com/AbiniveshMayilsamy/Google-Developer-Group-Solution-Challenge---Prism-AI.git)

*Google Developer Group Solution Challenge — Team Fortune 14*

</div>

---

## 📌 Table of Contents

1. [Problem Statement](#-problem-statement)
2. [Why PRISM AI?](#-why-prism-ai)
3. [Key Features](#-key-features)
4. [Architecture](#-architecture)
5. [Tech Stack](#-tech-stack)
6. [Live MVP Walkthrough](#-live-mvp-walkthrough)
7. [Local Setup](#-local-setup)
8. [Real-World Use Cases](#-real-world-use-cases)
9. [Local Bias Context (India)](#-local-bias-context-india)
10. [Bias Metrics Explained](#-bias-metrics-explained)
11. [Roadmap](#-roadmap)
12. [Cost Breakdown](#-cost-breakdown)
13. [Team](#-team)

---

## 🚨 Problem Statement

> **"Computer programs now make life-changing decisions about who gets a job, a bank loan, or even medical care. But if these programs learn from flawed or unfair historical data, they repeat and amplify the exact same discriminatory mistakes."**

AI systems today suffer from hidden biases that disproportionately affect marginalized communities. The core challenge:

| Challenge | Impact |
|-----------|--------|
| 📊 Biased training data | Perpetuates historical discrimination |
| 🔒 Black-box models | No visibility into how decisions are made |
| 🛠️ Developer-only tools | Non-technical teams can't audit fairness |
| 📍 International datasets | Don't reflect local bias patterns (e.g., India) |
| ⚡ No real-time protection | Biased predictions reach users unchecked |

---

## 🌟 Why PRISM AI?

Most existing tools like **IBM AI Fairness 360** are Python libraries — for data scientists only. **PRISM AI** is a full-stack, accessible web platform built for everyone: developers, HR teams, compliance officers, and ethics boards.

```
Existing Tools:        PRISM AI:
─────────────          ─────────────────────────────────────────
CLI only          →    Visual Web Dashboard
Data scientists   →    Non-technical users too
Post-deployment   →    Pre-deployment + Real-time Firewall
Single metric     →    SPD + DI + Geospatial + Drift over time
No explanations   →    Gemini-powered plain-language insights
```

---

## ✨ Key Features

### 1. 📊 Bias Auditing Engine
Upload a CSV/JSON dataset or enter data manually. PRISM AI calculates:
- **Statistical Parity Difference (SPD)** — measures outcome gap between groups
- **Disparate Impact (DI)** — ratio of favorable outcomes across protected groups
- Visual charts and instant fairness scores for every sensitive attribute

### 2. 🔥 AI Firewall *(Unique Feature)*
A real-time interception layer that sits between your model and your users:
- Blocks biased predictions **before they reach real people**
- Configurable fairness thresholds per use case
- Every block comes with a **Gemini-generated explanation**
- Full audit log of intercepted decisions

### 3. 📉 Drift Monitoring
Models degrade over time as new data enters the system:
- Time-series charts tracking fairness degradation
- Alerts when SPD/DI crosses acceptable thresholds
- Gemini-powered drift analysis and recommended interventions

### 4. 🧪 What-If Sandbox
Before deploying changes, test their fairness impact:
- Adjust data thresholds interactively
- See real-time predicted changes in SPD/DI
- Compare "before vs after" mitigation scenarios side-by-side

### 5. 🤖 AI Ethicist Chatbot
An always-on conversational assistant powered by **Gemini 1.5 Flash**:
- Explains bias concepts in plain language
- Provides legal context (GDPR, EU AI Act, India's PDPB)
- Suggests context-specific mitigation strategies
- Accessible from every page of the platform

### 6. 🗺️ Geospatial Bias Mapping *(Unique Feature)*
Visualizes how bias is distributed across regions:
- Interactive maps showing prediction disparity by geography
- Identifies regional discrimination patterns (e.g., North vs South India hiring bias)
- Drill-down capability for state-level analysis

### 7. 🕰️ Audit History
- Persistent log of all past audits stored in MongoDB
- Compare fairness trends across model versions
- Exportable reports for compliance and review boards

### 8. 🔐 Secure Authentication
- JWT-based user authentication
- Sign up, login, password reset
- Role-based access (coming soon: team workspaces)

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         PRISM AI Platform                        │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│   ┌─────────────┐    ┌──────────────────┐    ┌──────────────┐   │
│   │   Frontend  │    │     Backend      │    │  Google AI   │   │
│   │             │    │                  │    │              │   │
│   │  React 18   │◄──►│  Node.js +       │◄──►│ Gemini 1.5   │   │
│   │  Vite       │    │  Express.js      │    │ Flash API    │   │
│   │  Tailwind   │    │                  │    │              │   │
│   │  Recharts   │    │  JWT Auth        │    └──────────────┘   │
│   │  Framer     │    │  Bias Engine     │                        │
│   │  Motion     │    │  AI Firewall     │    ┌──────────────┐   │
│   └─────────────┘    │  Drift Monitor   │◄──►│   MongoDB    │   │
│                       └──────────────────┘    │   Atlas      │   │
│                                               │              │   │
│                       ┌──────────────────┐    │  Users       │   │
│                       │  Google Cloud    │    │  Audits      │   │
│                       │  Run (Deploy)    │    │  Drift       │   │
│                       └──────────────────┘    └──────────────┘   │
└─────────────────────────────────────────────────────────────────┘
```

### Data Flow

```
User uploads CSV/JSON
        │
        ▼
  Data Validation & Parsing (PapaParse)
        │
        ▼
  Bias Metrics Engine
  ├── Statistical Parity Difference (SPD)
  └── Disparate Impact Ratio (DI)
        │
        ▼
  Gemini 1.5 Flash API
  ├── Plain-language explanation
  ├── Mitigation recommendations
  └── Legal/compliance context
        │
        ▼
  Visual Dashboard (Recharts + Chart.js)
        │
        ▼
  AI Firewall (Real-time deployment guard)
        │
        ▼
  MongoDB Audit Log (Persistent history)
```

---

## 🛠️ Tech Stack

### Frontend
| Technology | Purpose |
|------------|---------|
| React 18 | UI framework |
| Vite | Build tooling & dev server |
| Tailwind CSS | Styling |
| Framer Motion | Animations |
| Lucide Icons | Icon library |
| Recharts / Chart.js | Data visualizations |
| PapaParse | CSV parsing |

### Backend
| Technology | Purpose |
|------------|---------|
| Node.js | Runtime |
| Express.js | API framework |
| @google/generative-ai | Gemini 1.5 Flash integration |
| JWT | Authentication |
| Mongoose ODM | MongoDB modeling |

### Cloud & AI
| Technology | Purpose |
|------------|---------|
| Google Cloud Run | Serverless deployment |
| MongoDB Atlas | Cloud database |
| Gemini 1.5 Flash | AI explanations & chatbot |

---

## 🚀 Live MVP Walkthrough

**🔗 Live URL:** https://google-developer-group-solution-cha.vercel.app/

| Step | Feature | What You Can Do |
|------|---------|-----------------|
| 1 | Sign Up / Login | Create an account with JWT-secured auth |
| 2 | Upload Dataset | Upload a CSV or enter data manually |
| 3 | Bias Audit | Receive SPD & DI scores with visual charts |
| 4 | Gemini Insights | Read plain-language explanations & recommendations |
| 5 | AI Firewall | Configure thresholds and simulate interception |
| 6 | Drift Monitor | View fairness over time with sample data |
| 7 | AI Chatbot | Ask the ethicist bot any bias-related question |
| 8 | Audit History | Review all past audits from your dashboard |

---

## 💻 Local Setup

### Prerequisites
- Node.js v18+
- MongoDB Atlas account (or local MongoDB)
- Google AI API Key (Gemini 1.5 Flash)

### Installation

```bash
# Clone the repository
git clone https://github.com/AbiniveshMayilsamy/Google-Developer-Group-Solution-Challenge---Prism-AI.git
cd Google-Developer-Group-Solution-Challenge---Prism-AI

# Install frontend dependencies
cd frontend
npm install

# Install backend dependencies
cd ../backend
npm install
```

### Environment Variables

Create a `.env` file in the `/backend` directory:

```env
PORT=5000
MONGODB_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_jwt_secret_key
GEMINI_API_KEY=your_google_gemini_api_key
```

### Run the Application

```bash
# Start backend (from /backend)
npm run dev

# Start frontend (from /frontend)
npm run dev
```

Open `http://localhost:5173` in your browser.

---

## 🌍 Real-World Use Cases

### 🏢 Hiring & Recruitment
Detect bias in resume screening algorithms:
- Regional discrimination (state-based preferences)
- Language/dialect bias (Hindi vs South Indian languages)
- Caste-based discrimination patterns
- Gender and age bias in shortlisting

### 🏦 Finance & Lending
Audit loan approval models:
- Income group bias
- Geographic lending disparities
- Risk model fairness across demographics
- RBI compliance alignment

### 🏥 Healthcare
Ensure equitable medical AI:
- Diagnostic model bias across age/gender
- Treatment recommendation fairness
- Insurance approval algorithm auditing

### 📱 Content & Recommendations
Fair content delivery:
- Recommendation diversity scoring
- Filter bubble detection
- Demographic reach analysis

---

## 🇮🇳 Local Bias Context (India)

A critical differentiator: most existing fairness datasets are built for **international (Western) markets**. PRISM AI is designed with **India-specific bias patterns** in mind:

| Bias Type | Example | PRISM AI's Approach |
|-----------|---------|---------------------|
| **Regional** | "We only hire local candidates" (Bangalore vs migrants) | Region-aware SPD calculation |
| **Language/Dialect** | South Indians rejected in North India for not knowing Hindi | Language attribute as protected variable |
| **Caste-based** | Resume screening bias based on surnames | Caste as sensitive attribute in audit |
| **State-level** | UP/Bihar migrant workers disadvantaged | Geospatial bias map with state-level drill-down |

> *"Most of the datasets that already exist are prepared for international markets. You need to prepare a dataset for your local users."*
> — Mentor feedback, GDG Solution Challenge review

**PRISM AI addresses this by:**
- Allowing custom sensitive attribute definition (not just race/gender)
- Supporting regional/linguistic attributes in bias calculations
- Geospatial mapping that works at the Indian state and district level

---

## 📐 Bias Metrics Explained

### Statistical Parity Difference (SPD)
```
SPD = P(Ŷ=1 | A=unprivileged) - P(Ŷ=1 | A=privileged)

Ideal value: 0.0
Acceptable range: -0.1 to 0.1
Flags: |SPD| > 0.1 = potential bias
```

### Disparate Impact (DI)
```
DI = P(Ŷ=1 | A=unprivileged) / P(Ŷ=1 | A=privileged)

Ideal value: 1.0
Acceptable range: 0.8 to 1.25 (80% rule)
Flags: DI < 0.8 = potential adverse impact
```

### How PRISM AI Uses These
1. Calculate raw SPD and DI from uploaded data
2. Gemini translates scores into plain-language verdict
3. AI Firewall blocks predictions that violate configured thresholds
4. Drift Monitor tracks how these metrics change over time

---

## 🗺️ Roadmap

### ✅ MVP (Current)
- [x] CSV/JSON dataset upload
- [x] SPD & Disparate Impact calculation
- [x] Gemini-powered explanations
- [x] AI Firewall with blocked-request logging
- [x] Drift Monitor with time-series charts
- [x] AI Ethicist Chatbot
- [x] JWT Authentication
- [x] MongoDB Audit History

### 🔜 Phase 2 (Next Sprint)
- [ ] Local Indian hiring dataset (curated for regional/caste/language bias)
- [ ] Admin panel with organization-level oversight
- [ ] API integration for HR systems (e.g., Keka, Zoho People)
- [ ] Exportable PDF compliance reports (EU AI Act, EEOC, PDPB)
- [ ] Caste attribute support in bias auditing

### 🔮 Phase 3 (Future)
- [ ] Multi-model support (HuggingFace, OpenAI, custom APIs)
- [ ] Team collaboration workspaces with role-based access
- [ ] Advanced geospatial heatmaps (district-level)
- [ ] Community bias benchmark database
- [ ] Mobile app for compliance officers
- [ ] RBI-aligned financial model compliance checks

---

## 💰 Cost Breakdown

| Component | Estimated Cost | Notes |
|-----------|---------------|-------|
| Google Cloud Run | ~$10–$30 / month | Pay-per-request; scales to zero |
| MongoDB Atlas (M10) | ~$57 / month | Production cluster |
| Gemini 1.5 Flash API | ~$0.075 / 1M tokens | Very low cost at scale |
| Domain + SSL | ~$15 / year | Standard security |
| **Total (monthly)** | **~$70–$90** | Scalable; drops at low usage |

> Gemini 1.5 Flash is one of the most cost-efficient LLMs available, making PRISM AI viable even for small organizations and NGOs.

---

## 👥 Team

**Team Name:** Fortune 14
**Challenge:** Google Developer Group Solution Challenge

| Member | Role |
|--------|------|
| Abinivesh M | Team Lead & Full Stack Developer |
| *(Team Member 2)* | *(Role)* |
| *(Team Member 3)* | *(Role)* |
| *(Team Member 4)* | *(Role)* |

---

## 📎 Links

| Resource | URL |
|----------|-----|
| 🚀 Live Demo | https://google-developer-group-solution-cha.vercel.app/ |
| ▶️ Demo Video | https://youtu.be/THLu6eF83dI?si=XJ7ad1A4A2wikdgH |
| 📁 GitHub | https://github.com/AbiniveshMayilsamy/Google-Developer-Group-Solution-Challenge---Prism-AI.git |

---

## 📄 License

This project was built for the Google Developer Group Solution Challenge. All rights reserved to Team Fortune 14.

---

<div align="center">

**Built with ❤️ by Team Fortune 14**

*Making AI fair, accessible, and accountable — for everyone.*

![Google](https://img.shields.io/badge/Google-Gemini%201.5%20Flash-4285F4?logo=google&logoColor=white)
![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=black)
![Node.js](https://img.shields.io/badge/Node.js-Express-339933?logo=node.js&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?logo=mongodb&logoColor=white)

</div>
