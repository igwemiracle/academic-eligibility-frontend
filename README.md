# Academic Eligibility Tracking System for Graduation Status Monitoring (Frontend)

A clean, responsive, and accessible Next.js web application built for the **Department of Computer Science** university final-year project. The system allows students and academic advisers to monitor undergraduate graduation eligibility progress in real time according to the official Computer Science Department Student Handbook, while providing the examination officer (department admin) with tools to administer curriculum courses, sessions, results (including batch CSV import), and graduation criteria.

---

## 🛠️ Stack & Dependencies

- **Framework**: Next.js 14 (App Router) with TypeScript in **strict mode**
- **Styling**: Tailwind CSS + `next-themes` (Dark and Light mode support)
- **UI Component Primitives**: `shadcn/ui` based on Radix UI (`button`, `card`, `input`, `label`, `table`, `tabs`, `dialog`, `sheet`, `dropdown-menu`, `select`, `badge`, `progress`, `skeleton`, `sonner`, `alert`, `separator`, `avatar`, `chart`)
- **Server State & Data Fetching**: TanStack Query (`@tanstack/react-query`) with custom typed hooks
- **Form Management & Validation**: React Hook Form with Zod (`@hookform/resolvers/zod`)
- **Data Visualizations**: Recharts integrated with shadcn's Chart component
- **Icons & Dates**: `lucide-react`, `date-fns`

---

## 🚀 Quick Start & Setup

### 1. Prerequisites
- Node.js 20+ (Node.js 24 supported)
- npm 10+

### 2. Environment Configuration
Copy `.env.example` to `.env.local`:
```bash
cp .env.example .env.local
```

Default settings:
```env
# Backend REST API Base URL
NEXT_PUBLIC_API_URL=http://localhost:4000/api/v1

# Mock layer toggle (set to 'false' to communicate with the real backend)
NEXT_PUBLIC_USE_MOCKS=true
```

> **Note on Mock Layer**: When `NEXT_PUBLIC_USE_MOCKS=true`, the application includes an isolated, contract-accurate in-memory mock engine that automatically simulates all endpoints, role sessions, status checks, results breakdown, and CSV import without needing the backend or database to be running. Setting it to `false` routes all requests to `NEXT_PUBLIC_API_URL` with `credentials: "include"`.

### 3. Install Dependencies
```bash
npm install
```

### 4. Run the Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your web browser.

### 5. Build & Lint Verification
- Run production build:
  ```bash
  npm run build
  ```
- Run linter:
  ```bash
  npm run lint
  ```

---

## 🔑 Demo Accounts & Seed Scenarios

All accounts share the default password: **`Password123!`** (also pre-fillable directly from the login page):

| Role | Name | Email | Scenario / Notes |
|---|---|---|---|
| **STUDENT** | Adebayo Olawale | `student_a_eligible@cs.edu.ng` | **ELIGIBLE**: 171 units earned, CGPA 4.70, First Class |
| **STUDENT** | Chioma Okoli | `student_b_shortunits@cs.edu.ng` | **NOT_YET_ELIGIBLE**: 161/166 units (5 units short), 1 carryover |
| **STUDENT** | Lukman Gbadamosi | `student_j_de_eligible@cs.edu.ng` | **ELIGIBLE**: Direct Entry (122/121 units earned) |
| **ADVISER** | Dr. Ngozi Okonjo | `adviser1@cs.edu.ng` | Senior Adviser (Manages Level 300 & 400 roster) |
| **ADMIN** | Dr. Ibrahim Musa | `admin@cs.edu.ng` | Department Examination Officer / Administrator |

---

## 📂 Project Architecture

```
├── .env.example              # Environment variables template
├── components.json           # shadcn/ui configuration
├── package.json              # Project dependencies & scripts
├── tailwind.config.ts        # Tailwind CSS and theme tokens
├── src/
│   ├── app/                  # Next.js App Router routes
│   │   ├── admin/            # Admin screens (stats, users, courses, sessions, results, rules, audit logs)
│   │   ├── adviser/          # Adviser screens (roster, student progress & transcript detail)
│   │   ├── student/          # Student screens (dashboard, results, settings)
│   │   ├── login/            # Public authentication page with demo prefill
│   │   ├── globals.css       # Academic color scheme tokens & dark mode classes
│   │   ├── layout.tsx        # Root layout with QueryClient & ThemeProvider
│   │   └── not-found.tsx     # Custom 404 page
│   ├── components/
│   │   ├── auth/             # RoleGuard client boundary (401 / 403 handling)
│   │   ├── layout/           # AppShell (desktop sidebar, mobile sheet, topbar, theme toggle)
│   │   ├── shared/           # Reusable ProgressSummaryView, ResultsView, AcademicChart, ErrorState, Skeletons
│   │   └── ui/               # shadcn/ui components (button, badge, card, dialog, table, tabs, etc.)
│   ├── hooks/                # TanStack Query custom hooks per endpoint
│   │   ├── use-admin.ts      # Admin query & mutation hooks
│   │   ├── use-adviser.ts    # Adviser query hooks
│   │   ├── use-auth.ts       # Auth query & mutation hooks
│   │   └── use-student.ts    # Student progress & results hooks
│   ├── lib/
│   │   ├── api.ts            # Typed fetch client with credentials: "include", ApiError, & mock interceptor
│   │   ├── mock-data.ts      # Comprehensive seed data matching the API contract
│   │   ├── types.ts          # TypeScript interfaces matching backend contract
│   │   ├── utils.ts          # Formatting helpers (formatCgpa, formatUnits, cn)
│   │   └── validation/       # Zod schemas for all application forms
│   └── middleware.ts         # Route protection checking access_token cookie
```

---

## 📖 Academic Handbook Computation Standards

1. **Credit Unit Thresholds**:
   - **UTME Students**: Minimum **166 credit units** required for graduation.
   - **Direct Entry (DE) Students**: Minimum **121 credit units** required (exempt from all 100-level courses).
2. **Handbook Academic Metrics**:
   - **TCC**: Total Credit Units Carried in a semester.
   - **TCE**: Total Credit Units Earned in a semester (courses passed with score ≥ 40%).
   - **TPE**: Total Grade Points Earned in a semester ($\sum \text{Units} \times \text{GP}$).
   - **Semester GPA**: $\text{TPE} / \text{TCC}$ (rounded to 2 decimal places).
   - **CCC**: Cumulative Credit Units Carried across all registered semesters.
   - **CCE**: Cumulative Credit Units Earned (each passed course counted once).
   - **CPE**: Cumulative Grade Points Earned across all registered semesters.
   - **CGPA**: $\text{CPE} / \text{CCC}$ (failed courses and re-sits remain in CCC and in CGPA calculation permanently as specified in Section 11.1.8 of the Handbook).
3. **Official Clearance Boundary**:
   - The tracking system displays calculated eligibility status. Official graduation clearance remains under the jurisdiction of the Department Examination Officer, as indicated on the student dashboard.

---

## 📝 Assumptions

1. **Direct Entry Course Exemption**:
   - Direct Entry students are admitted directly into 200 Level; 100-level courses are neither required nor registered for them, and their graduation requirement is 121 units instead of 166.
2. **Repeated Course Display in Transcripts**:
   - If a student fails a course (e.g., CMP 211 with Grade F in 2021/2022) and passes on a subsequent re-sit in 2022/2023, both attempts appear in their respective academic session tables. Both credit units carried remain part of cumulative CCC, but the earned credit units (CCE) are counted only once.
3. **Degree Classification Standing**:
   - The class of degree shown next to the student's CGPA is explicitly labelled as an indicative *current standing* based on cumulative results to date, rather than a final graduation conferral.
4. **Mock vs Production Backend Switch**:
   - Development defaults to `NEXT_PUBLIC_USE_MOCKS=true` so the app is immediately reviewable without requiring Docker or a running PostgreSQL instance. Setting `NEXT_PUBLIC_USE_MOCKS=false` seamlessly delegates all network requests to the real backend running on `http://localhost:4000/api/v1`.
