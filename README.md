<<<<<<< HEAD
# Learning Hub (standalone)

This project is a standalone extraction of the Learning Hub feature from the supplied Study With Abhi archive. It contains only the Learning Hub UI, local learning data, syllabus data, certificate system, server routes, and the shared Study With Abhi brand asset used by certificates.

## Included features

- YouTube course conversion and the curated course catalogue
- Course player, notes, progress tracking, planner, syllabus tracker, practice tools, analytics, and settings
- AI tutor, summaries, quizzes, study-plan generation, flashcards, and recommendations through an optional OpenRouter key
- Certificate issuing, local browser history, and public verification endpoints backed by `server/learningHub/certificates-registry.json`

## Run locally

1. Install Node.js 20 or newer.
2. In this folder, run `npm install`.
3. Copy `.env.example` to `.env`. Add `OPENROUTER_API_KEY` only if you want the AI tools.
4. Run `npm run dev`, then open `http://localhost:3000`.

`npm run build` creates a production `dist` folder. `npm start` serves that build.

## Publish as a separate GitHub repository

Create an empty GitHub repository first (for example, `learning-hub-standalone`) without a README, license, or `.gitignore`. Then run these commands from this project folder:

```bash
git init
git add .
git commit -m "Initial standalone Learning Hub"
git branch -M main
git remote add origin https://github.com/YOUR-GITHUB-USERNAME/learning-hub-standalone.git
git push -u origin main
```

Replace `YOUR-GITHUB-USERNAME` with your GitHub username. Keep `.env` private: it is ignored by Git and must never be committed.

## Data and deployment notes

- Student data, course progress, notes, and settings live in that browser's local storage. The standalone project uses new `learning_hub_*` keys and does not reuse the main site's browser keys.
- The certificate registry starts empty. The server writes issued certificates into `server/learningHub/certificates-registry.json`; a serverless or read-only deployment needs a database/object store before certificate issuance and public verification can be durable.
- YouTube metadata and OpenRouter calls require internet access at runtime. AI tools remain unavailable until `OPENROUTER_API_KEY` is configured.
- The original certificate artwork retains the shared Study With Abhi logo. Replace `src/components/StudyWithAbhiLogo.tsx` and `public/study_with_abhi_logo.svg` if you want independent branding.

See `SEPARATION_REPORT.md` for the exact separation boundary and known limitations.
=======
# learning-hub-standalone
>>>>>>> b5ba873adf0fc7cf35ca53e0b4b9bbe826925fc3
