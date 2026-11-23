# CareerAI PH

**Connect what you learn today with the AI skills you'll need tomorrow.**

CareerAI PH is an AI-powered learning and career-readiness platform designed to help Filipino college students connect their current academic subjects and classroom topics with relevant artificial intelligence (AI) skills, tools, and technologies needed for their intended careers.

Rather than providing generic AI courses or recommendations, CareerAI PH uses students' academic information and career interests to generate personalized AI learning recommendations and structured learning roadmaps.

**Live Application:** https://careerai-ph.vercel.app/

**GitHub Repository:** https://github.com/sinnedNot/careerai-ph

---

## 1. The Problem

Artificial intelligence is changing industries and the skills employers need. However, college students may struggle to understand which AI technologies and skills are relevant to their current academic programs and future careers.

CareerAI PH addresses this gap by connecting what students learn in their college classrooms with practical AI-related knowledge they can develop for their intended careers.

## 2. Project Objectives

- Help college students identify AI skills relevant to their academic subjects.
- Connect classroom topics with emerging AI technologies and tools.
- Provide personalized AI learning recommendations based on career interests.
- Generate structured learning roadmaps.
- Encourage practical learning through objectives and activities.
- Help students become more prepared for an AI-driven workplace.

## 3. Core Features

### Student Authentication
- Student registration and login.
- Protected student dashboard.
- Logout functionality.

### Student Profile
- Manage degree program.
- Specify year level.
- Indicate current AI knowledge level.

### Academic Subjects
- Add and manage college subjects.
- Record current classroom topics.
- Edit and remove subjects.

### Career Interests
- Add career interests.
- View saved career interests.
- Remove career interests.

### AI Recommendations
- Generate personalized AI learning recommendations.
- Connect recommended AI topics with actual classroom topics.
- Explain relevance to intended careers.
- Recommend relevant AI tools.
- Provide learning objectives and practical activities.
- Assign priority levels.

### Learning Roadmap
- Generate personalized AI learning roadmaps.
- Organize learning into Foundation, Intermediate, and Applied stages.
- Provide learning objectives and practical activities.
- Track completed learning activities.
- Display learning progress.

## 4. Technology Stack

| Technology | Purpose |
|---|---|
| Next.js 16 | Application framework |
| React 19 | User interface |
| TypeScript | Type safety |
| Tailwind CSS | Styling |
| Supabase | Database and authentication |
| PostgreSQL | Relational database |
| OpenAI API through Vocareum Gateway | AI recommendation and roadmap generation |
| Vercel AI SDK | AI integration |
| Zod | Input and AI output validation |
| Vitest | Unit testing |
| GitHub | Version control |
| GitHub Actions | Automated quality checks |
| Vercel | Application hosting and analytics |

## 5. System Architecture

CareerAI PH uses the Next.js App Router architecture.

The application handles user authentication and data access through Supabase. AI generation requests are processed through server-side API routes using the Vercel AI SDK and the configured OpenAI-compatible Vocareum Gateway.

Generated recommendations and learning roadmaps are validated before being saved to the database.

**Main application flow:**

1. Student registers or logs in.
2. Student completes their profile.
3. Student adds college subjects and classroom topics.
4. Student identifies career interests.
5. The AI generates personalized recommendations.
6. The student generates a structured learning roadmap.
7. The student tracks learning progress.

## 6. Database Structure

The application uses Supabase PostgreSQL.

Main tables:

- `profiles`
- `subjects`
- `career_interests`
- `recommendations`
- `learning_roadmaps`
- `roadmap_items`

Row Level Security (RLS) policies help ensure students can access only their own protected records.

## 7. Getting Started

### Prerequisites

- Node.js 22 or compatible supported version.
- npm.
- Git.
- A Supabase project.
- Access to the configured AI API provider.

### Clone the repository

```bash
git clone https://github.com/sinnedNot/careerai-ph.git
cd careerai-ph
```

### Install dependencies

```bash
npm install
```

### Configure environment variables

Create a `.env.local` file in the project root.

Use the following variables:

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=
OPENAI_API_KEY=
OPENAI_BASE_URL=https://openai.vocareum.com/v1
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

Add the appropriate credentials from your own Supabase project and authorized AI API provider.

**Security:** Never commit `.env.local` or expose API keys and private credentials in source code.

### Run the development server

```bash
npm run dev
```

Open:

http://localhost:3000

## 8. Testing and Quality Checks

Run ESLint:

```bash
npm run lint
```

Run unit tests:

```bash
npm run test
```

Build the application:

```bash
npm run build
```

GitHub Actions automatically runs the configured quality checks when code is pushed to the `master` branch or a pull request targets that branch.

## 9. Deployment

CareerAI PH is deployed using Vercel.

Production URL:

https://careerai-ph.vercel.app/

Deployment process:

1. Push changes to the GitHub repository.
2. GitHub Actions runs automated quality checks.
3. Vercel builds and deploys the application.
4. Verify the deployed application.

Production environment variables are configured through the Vercel project settings.

Vercel Web Analytics is integrated for basic website usage monitoring.

## 10. Security Considerations

- Supabase Row Level Security protects user-owned database records.
- Authentication is checked on protected application routes and API endpoints.
- Server-side AI requests keep the AI API key out of browser code.
- Zod validates relevant inputs and structured AI outputs.
- Environment files containing secrets are excluded from Git.

The application is a learning and career-readiness guidance tool. Its recommendations are informational and do not guarantee employment outcomes.

## 11. Current Development Status

The core MVP has been implemented and deployed.

Completed development phases:

- Phase 1 – Validate and Define
- Phase 2 – Spec and Architecture
- Phase 3 – Build
- Phase 4 – Deploy

Phase 5 – Document and Reflect is currently in progress.

## 12. Future Improvements

Potential improvements for future versions include:

- Password reset flow verification.
- Learning roadmap history.
- API rate limiting.
- Expanded AI learning resources.
- Improved recommendation quality.
- Additional student feedback and usability improvements.
- More academic programs and career pathways.

## 13. Project Information

**Project Name:** CareerAI PH

**Platform Type:** AI-powered learning and career-readiness platform

**Target Users:** Filipino college students

**Primary Goal:** Connect current college learning with relevant AI skills for future careers.

---

*CareerAI PH — Connect what you learn today with the AI skills you'll need tomorrow.*