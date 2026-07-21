# GRAM-SETU (Village Bridge)
### AI-Driven Cash Flow Prediction & Risk Flagging System for Rural Micro Enterprises
**NABARD Hackathon @ Global Fintech Fest 2026**

> *"Money that stays in the village, until it's ready to earn the village a real bank loan."*

---

## 1. Problem We're Solving

India has millions of rural micro enterprises — SHGs, FPOs, dairy units, kirana shops, artisans — most without formal credit histories. Financial-health monitoring today is manual and reactive: institutions and field officers only find out about distress *after* it happens, not before.

GRAM-SETU is our answer to the brief exactly as stated: an integrated, AI-driven system that fuses financial records, digital transaction proxies, market intelligence, and climate data into a **3–6 month cash-flow forecast**, flags risk early, and — critically — gives both the enterprise and the field officer something *actionable*, not just a number.

---

## 2. What Makes This Different

Most solutions to this brief will stop at "AI scores a farmer's risk for a bank to see." We built something closer to what NABARD's own SHG-Bank Linkage Programme already does in the real world — and made it explainable, offline, and privacy-safe by design:

- **The enterprise owner is the primary user**, not a data point scored for someone else. Every risk alert comes with a plain-language, voice-explained reason and a concrete next step.
- **Sector-specific modeling, not one generic score.** Dairy, poultry, food processing, handicrafts, and rural retail each have distinct volatility drivers — a rainfall deviation means something completely different to a dairy farmer than to an artisan, and our models reflect that.
- **The Graduation Pathway.** As a Self-Help Group's collective lending track record strengthens, the platform auto-compiles an audit-ready credit appraisal packet — the literal bridge between informal village trust and formal bank credit that NABARD's brief names as a value goal, not just implies.
- **Every AI-generated recommendation is labeled and overridable.** Internal lending rates suggested by the model are shown as an editable control, tagged permanently: *"AI Suggested — Group Decides."* Nothing is automated without a human decision.

---

## 3. Product Overview — Four Purpose-Built Views

| View | Primary User | What It Does |
|---|---|---|
| **Enterprise App** | MSME / SHG member | Sector-specific data entry, Resilience Score, plain-language + voice-explained risk alerts, actionable suggestions |
| **Field Officer Console** | Field officer / institution | Portfolio list with risk status, detailed enterprise profiles, cash-flow forecast charts, prioritized risk panel |
| **Village Pool** | Bachat gat / SHG | Aggregated group corpus, loan-out tracking, NABARD-style A/B/C group grade, AI-suggested (group-overridable) internal interest rate |
| **Graduation Pathway** | SHG + partner bank | Auto-compiled, exportable credit appraisal packet once a group's track record crosses a defined threshold |

---

## 4. How It Works — Process Flow

```
Data Entry (offline)
        │
AI Feature Extraction  →  sector volatility + climate/market signal
        │
Resilience Scoring Engine  →  Liquidity Health | Shock Exposure | Behavioral Trend
        │
Risk Alert + Voice Explanation  →  plain language, local language
        │
Sync to Field Officer Console  (when connectivity available)
        │
Village Pool Aggregation  →  Group Grade (A/B/C)
        │
Graduation Pathway  →  bank-ready credit appraisal packet
```

---

## 5. Technology Stack

| Layer | Technology | Why |
|---|---|---|
| Frontend | HTML/CSS/JS + React (PWA) | Installable, works across low-end devices, no app-store friction |
| Offline layer | Service Workers + IndexedDB | Core loop functions with zero network — satisfies the brief's offline constraint directly |
| Voice | Web Speech API (`speechSynthesis`) | Free, on-device, works offline — no external voice API dependency for the core demo |
| Backend | Node.js + Express (MERN) | Sync engine, conflict resolution, REST API |
| Database | MongoDB | Aggregate-only schema — no raw transaction-level or personally identifying data is ever stored |
| Scoring microservice | Java (Spring Boot) | Sector-specific weighted risk rules, enterprise-grade and independently deployable |
| Simulation engine | C++ | Monte-Carlo shock simulation (weather/price shocks → 90-day cash-flow projection), pre-computed and cached for offline replay |
| Real data sources | Agmarknet / eNAM, IMD | Commodity price and rainfall data — genuinely public and free, clearly labeled as real |
| Mock data | Synthetic ledger generator | Clearly labeled as synthetic throughout the UI, per the brief's explicit constraint |

---

## 6. How This Maps to Every Explicit Constraint in the Brief

| Brief Requirement | How GRAM-SETU Satisfies It |
|---|---|
| 3–6 month cash-flow prediction | Time-series forecast + Monte-Carlo shock overlay, shown on both Enterprise and Field Officer views |
| Multi-source data integration | Financial ledger + climate (IMD) + market (Agmarknet/eNAM) + transaction-proxy indicators, fused sector-by-sector |
| Early warning system | Resilience Score with three explainable sub-scores, not a single opaque number |
| Sector-specific risk | Distinct weight profiles per sector (starting with Dairy and Rural Retail, extensible config-driven to Poultry, Food Processing, Handicrafts) |
| Actionable insights | Every alert names its weakest driver and pairs it with a concrete next step |
| Two distinct deliverables (enterprise + field officer) | Built as genuinely separate interfaces solving different jobs-to-be-done, not one dashboard with a toggle |
| Sector-specific risk dashboard | Village Pool + Field Officer risk panel, color-coded by sector and band |
| Climate & market risk integration | C++ shock simulator fusing rainfall deviation and commodity price trend, sector-weighted |
| Mock/simulated datasets | Explicitly labeled in-app; not disguised as real |
| Offline / low-network operation | Core loop (entry → score → alert → voice explanation) requires zero network calls |
| No sensitive personal information | Only aggregated, derived indicators ever leave the enterprise's own record — no raw transaction data stored or transmitted |
| Multilingual support (optional) | English + Hindi implemented; extensible via the same explanation-template architecture |

---

## 7. Value Creation for NABARD — Mapped Directly

1. **Enhanced credit flow to underserved enterprises** — explainable, sector-specific forecasts give banks a credible appraisal signal for entities with no formal credit history, reducing manual underwriting friction.
2. **Credit-led Rural Development** — the Graduation Pathway is a literal, mechanical implementation of the bridge from grant-based support to institutional finance: a group's proven internal repayment record becomes its formal credit application.
3. **Creation of a Digital Public Good** — the scoring and explanation engine is API-first, designed to be embedded into any bank's, RRB's, or SHG federation's existing systems, not a closed app.
4. **Better outcomes for beneficiaries** — the enterprise owner is the primary user of the primary interface, receiving direct, explainable, actionable insight in their own language — not a score computed *about* them for someone else's benefit.

---

## 8. What's Real vs. What's Modeled (Stated Upfront, On Purpose)

We believe stating this clearly is a strength, not a weakness:

- **Real:** commodity price data (Agmarknet/eNAM), rainfall/climate data (IMD), the full scoring/explanation/offline architecture.
- **Synthetic, clearly labeled:** enterprise financial ledgers and transaction-proxy indicators — no hackathon team has legitimate access to real UPI or bureau data, and we chose transparency over disguising that boundary.
- **Modeled for demo purposes:** any fund-settlement flow is explicitly labeled *"Settlement modeled on NABARD institutional rails — Demo Mode"* — this is a deliberate architectural placeholder for how a real institutional integration would work, not a claim of one existing today.

---

## 9. Deliberately Out of Scope (This Round)

We scoped these out to protect reliability of the core demo, and would prioritize them next:
- Live multi-agent LLM negotiation between borrower and lender policy agents
- Full five-sector model coverage (two sectors built deeply first; architecture is config-driven for the rest)
- Production-grade authentication and real payment-rail integration

---

## 10. Getting Started

```bash
# Clone and install
git clone <repo-url>
cd gram-setu

# Frontend
cd client && npm install && npm start

# Backend
cd server && npm install && npm run dev
```

Open `http://localhost:3000` — try the Enterprise App tab first, add a Dairy and a Rural Retail entry, then check the Field Officer Console and Village Pool tabs to see the same data aggregate live. Turn off your network connection at any point — the core experience keeps working.

---

## 11. Team & Contact

*(Add team name, member names, and contact details here before submission.)*

---

### One-line summary
**GRAM-SETU predicts financial stress for rural micro-enterprises with sector-aware, explainable AI — and turns every village's own lending track record into the bridge toward formal bank credit, exactly as NABARD's own mandate describes.**
