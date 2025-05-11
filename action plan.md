Okay, this is an excellent and well-defined set of requirements. The "Modern E-Learning Platform" prompt provides a solid technical foundation, and the "NaijaLearn PRD" gives it a specific, culturally rich application. My role as a Senior Lead Software Engineer will be to synthesize these into a practical, phased action plan.

Here’s a comprehensive action plan for developing NaijaLearn:

## NaijaLearn: Development Action Plan

**Project Vision:** To build NaijaLearn, an interactive e-learning platform focused on Nigerian culture, languages, and traditions, using a modern, scalable tech stack, and providing an engaging user experience.

**Guiding Principles:**
*   **Iterative & Incremental:** We will follow the Vertical Slice methodology, building end-to-end features and enhancing them progressively.
*   **User-Centric Design:** Focus on intuitive navigation and engaging interactions.
*   **Quality & Robustness:** Emphasize clean code, comprehensive testing, security, and performance from the outset.
*   **Modularity:** Design reusable components and well-defined services.
*   **Collaboration (Assumed):** Clear communication and defined responsibilities if working within a team.

**Confirmed Technology Stack:**
*   **Frontend Framework:** Next.js 15 (App Router)
*   **Styling:** Tailwind CSS v4 (utilizing stable features; if issues arise, will revert to stable Tailwind v3 patterns for specific problematic features, clearly documenting why)
*   **State Management:** Redux Toolkit
*   **Deployment:** Vercel
*   **Backend & Database (BaaS):** Supabase (Authentication, Database, Storage)
*   **Content Management System (CMS):** Sanity.io
*   **Interactive Component Libraries:**
    *   `@dnd-kit/core` for drag-drop
    *   `Framer Motion` for animations
    *   `React-Leaflet` for interactive maps

---

### Phase 0: Foundation & Setup (Sprint 0 - ~1 Week)

**Objective:** Establish the project's technical backbone, development environment, and initial infrastructure.

1.  **Project Initialization:**
    *   Set up Next.js 15 project: `npx create-next-app@latest --typescript`
    *   Initialize Git repository.
    *   Integrate Tailwind CSS v4: Follow official installation for Next.js. Create `tailwind.config.ts` and `postcss.config.js`. Define initial theme colors (primary, secondary, accent, text, feedback) and typography (fonts) as per UI Design Description.
    *   Set up Redux Toolkit: Install `react-redux` and `@reduxjs/toolkit`. Create `store/` directory, `store.ts`, and a root `Provider` in `app/layout.tsx`.
2.  **Service Setup:**
    *   **Supabase:**
        *   Create a new Supabase project.
        *   Note API URL and `anon` key. Set these up as environment variables (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`).
        *   Define initial DB schema (SQL scripts in `supabase/migrations`):
            *   `profiles` (linked to `auth.users` via `id` (UUID), `full_name`, `avatar_url`, `updated_at`, `cultural_interests` (text[] or jsonb)).
            *   Enable RLS on `profiles` table by default.
    *   **Sanity.io:**
        *   Create a new Sanity project: `npx sanity init --coupon naijalearn` (or similar).
        *   Note Project ID and Dataset. Set these up as environment variables (`NEXT_PUBLIC_SANITY_PROJECT_ID`, `NEXT_PUBLIC_SANITY_DATASET`, `SANITY_API_TOKEN` for write access if needed from server).
        *   Initialize basic Sanity schema files in `sanity/schemas/` (e.g., `course.ts`, `author.ts` as placeholders).
        *   Configure Sanity Studio basic desk structure.
3.  **Core Project Structure:**
    *   Set up directory structure: `app/`, `components/ui/`, `components/features/`, `lib/` (for Supabase/Sanity clients, utils), `store/`, `types/`, `sanity/`, `public/`.
    *   Create Supabase client (`lib/supabaseClient.ts`).
    *   Create Sanity client (`lib/sanityClient.ts`).
4.  **Basic Layout & UI Shell:**
    *   Implement `app/layout.tsx` with HTML shell, Redux Provider, Tailwind base styles.
    *   Create basic `Navbar` and `Footer` components (`components/layout/`).
    *   Implement basic UI components in `components/ui/` (e.g., `Button`, `Card`, `Input` - can be placeholders or basic styles initially). Consider ShadCN/UI structure but styled with Tailwind v4 directly.
5.  **Deployment & CI/CD (Initial):**
    *   Connect Git repository to Vercel.
    *   Configure Vercel environment variables.
    *   Set up basic CI pipeline (e.g., GitHub Actions) for linting and type-checking on push.

---

### Phase 1: Core User Journey - Authentication & Course Discovery (MVP) (Sprints 1-3 - ~3 Weeks)

**Objective:** Allow users to sign up, log in, view their profile, discover, and view basic course information.

1.  **User Authentication Slice (Initial Implementation):**
    *   **Supabase Auth:**
        *   Implement email/password registration, login, logout using Supabase client.
        *   Create auth forms (`components/auth/SignupForm.tsx`, `LoginForm.tsx`).
        *   Implement password recovery flow.
        *   Manage auth state in `store/slices/authSlice.ts` (user object, loading, error states).
        *   Create `useAuth` hook for easy access to auth state and actions.
    *   **User Profile:**
        *   Profile page (`app/(protected)/dashboard/profile/page.tsx`) to view/edit basic info (full name, avatar upload to Supabase Storage).
        *   Supabase RLS:
            *   `profiles`: Users can only select/update their own profile. Public read access for `avatar_url` and `full_name` if needed for display.
        *   Protected routes middleware using Next.js middleware for `/dashboard/*`.
2.  **Sanity Content Modeling (Courses):**
    *   Refine `course` schema: `title` (string), `slug` (slug), `description` (text), `excerpt` (string), `mainImage` (image), `category` (reference to `category` schema), `difficulty` (string options), `instructor` (reference to `instructor` schema), `modules` (array of references to `module` schema).
    *   Define `category` schema: `title` (string), `slug` (slug), `description` (text).
    *   Define `instructor` schema: `name` (string), `bio` (text), `picture` (image).
    *   Define `module` schema: `title` (string), `lessons` (array of references to `lesson` schema).
    *   Define `lesson` schema: `title` (string), `slug` (slug), `content` (portableText), `videoUrl` (url), `resources` (array of objects: `name`, `fileUrl` (file) or `linkUrl` (url)).
    *   Populate Sanity with 2-3 sample courses, with modules and lessons (text, video URLs).
3.  **Course Discovery & Enrollment Slice (Initial Implementation):**
    *   **Homepage (`app/page.tsx`):**
        *   Fetch and display featured courses (e.g., latest 3) from Sanity (SSG/ISR).
        *   Display categories (SSG/ISR).
        *   Basic search bar (client-side filtering initially, or link to `/courses` page with query).
    *   **Course Listing Page (`app/courses/page.tsx`):**
        *   Fetch all courses from Sanity (SSG/ISR).
        *   Implement `CourseCard` component (`components/features/courses/CourseCard.tsx`).
        *   Client-side filtering by category, difficulty. Client-side sorting.
    *   **Detailed Course Page (`app/courses/[slug]/page.tsx`):**
        *   Fetch single course data (including modules, lessons list) from Sanity using `slug` (SSG/ISR).
        *   Display course description, curriculum (module titles, lesson titles), instructor info.
        *   **Enrollment (Free MVP):**
            *   "Enroll" button.
            *   On click, create an entry in Supabase `enrollments` table (`user_id`, `course_id` (Sanity course `_id`), `enrolled_at`).
            *   Supabase Schema: `enrollments` (user_id (FK to auth.users), course_id (text, stores Sanity `_id`), enrolled_at (timestampz)). RLS: User can CRUD their own enrollments. Admins can read all.
            *   Update UI to reflect enrollment status.

---

### Phase 2: Core E-Learning Mechanics - Consumption & Quizzes (Sprints 4-6 - ~3 Weeks)

**Objective:** Enable users to consume course content, track progress, and take basic quizzes.

1.  **Course Consumption Slice (Initial Implementation & Enhancements):**
    *   **Lesson View Page (`app/courses/[courseSlug]/lessons/[lessonSlug]/page.tsx`):**
        *   Fetch specific lesson content (portable text, video URL, resources) from Sanity.
        *   Render portable text using `@portabletext/react`.
        *   Embed video player (e.g., `react-player` for YouTube/Vimeo).
        *   Display downloadable resources.
        *   Navigation: "Previous/Next Lesson" buttons.
        *   Course Structure Sidebar: Display modules and lessons for the current course, highlighting the active lesson. Collapsible on mobile.
2.  **Progress Tracking Slice (Initial Implementation):**
    *   **Supabase Schema:**
        *   `lesson_progress` (id, user_id, lesson_id (Sanity lesson `_id`), course_id (Sanity course `_id`), `completed_at` (timestampz), `status` (enum: 'not_started', 'in_progress', 'completed')). RLS: User can CRUD their own progress.
    *   **Functionality:**
        *   "Mark as Complete" button on lesson page. Updates `lesson_progress` in Supabase.
        *   Automatically mark as complete if a quiz at the end of a lesson is passed.
        *   Track progress for modules (derived from lesson completion).
3.  **User Dashboard (`app/(protected)/dashboard/page.tsx`):**
    *   View enrolled courses (fetch from `enrollments` and enrich with Sanity course data).
    *   Display progress bar for each course (calculated from `lesson_progress`).
    *   "Resume Learning" link to the last viewed/incomplete lesson.
4.  **Quiz System & Slice (Initial Implementation):**
    *   **Sanity Schema:**
        *   `quiz` schema: `title` (string), `questions` (array of references to `question` schema).
        *   `question` schema: `text` (string), `questionType` (string, default 'multipleChoice'), `options` (array of objects: `text` (string), `isCorrect` (boolean)), `explanation` (text, optional).
        *   Link quizzes to `lesson` schema (e.g., `lesson.quiz` (reference to `quiz`)).
    *   **Quiz Consumption (`components/features/quiz/QuizPlayer.tsx`):**
        *   Fetch quiz data from Sanity.
        *   Display questions and multiple-choice options (radio buttons).
        *   Submit answers.
        *   Immediate feedback (correct/incorrect, show explanation if available).
        *   Calculate score.
    *   **Supabase Schema:**
        *   `quiz_attempts` (id, user_id, quiz_id (Sanity quiz `_id`), lesson_id (Sanity lesson `_id`), `score` (integer), `submitted_at` (timestampz), `answers_payload` (jsonb)). RLS: User can CRUD own attempts.
        *   Store quiz attempts and results.
        *   Update `lesson_progress` based on quiz passing criteria.

---

### Phase 3: NaijaLearn Specific Interactive Features (Sprints 7-10 - ~4 Weeks, Parallelizable)

**Objective:** Implement the unique interactive cultural learning components.

*For each interactive slice: Design Sanity schema, build Next.js component, integrate any necessary libraries, and handle state/persistence.*

1.  **Interactive Map Slice (`react-leaflet`):**
    *   **Sanity:** `mapLocation` schema (`name`, `coordinates` (geopoint), `description` (portableText), `cultural_significance` (text), `media` (array of images/videos)). `culturalMap` schema (`title`, `locations` (array of references to `mapLocation`)).
    *   **Next.js:** Component using `react-leaflet` to display a map of Nigeria. Plot `mapLocation` points. On click, show info in a popup or sidebar.
    *   Enhancements: Region highlighting, cultural overlays, zoom/pan.
2.  **Language Pronunciation Tool Slice:**
    *   **Sanity:** `languageTerm` schema (`term` (string), `language` (e.g., Yoruba, Igbo, Hausa), `phonetic_transcription` (string), `audio_pronunciation` (file), `meaning` (text), `category` (string)).
    *   **Next.js:** Component to list terms. Play audio. Display phonetic transcription.
    *   Enhancements: Playback speed, recording/playback (requires browser MediaRecorder API).
3.  **Drag-and-Drop Cultural Matching Slice (`@dnd-kit/core`, `Framer Motion`):**
    *   **Sanity:** `matchingActivity` schema (`title`, `instruction`, `pairs` (array of objects: `itemA_text` (string), `itemA_image` (image), `itemB_text` (string), `itemB_image` (image))).
    *   **Next.js:** Component using `@dnd-kit` for drag-drop functionality. `Framer Motion` for smooth animations. Provide feedback on matches.
    *   Enhancements: Scoring, timed challenges, difficulty levels.
4.  **Recipe Simulator Slice (Content Focus first, interactivity later):**
    *   **Sanity:** `recipe` schema (`title`, `description`, `prep_time`, `cook_time`, `servings`, `ingredients` (array of objects: `name`, `quantity`, `unit`), `steps` (portableText with options for images/short video clips per step), `cuisine_type` (e.g., Nigerian regional)).
    *   **Next.js:** Component to display recipes clearly. Step-by-step navigation.
    *   Enhancements: Interactive ingredient selection (checkboxes), cooking technique demos (embedded video snippets per step).

---

### Phase 4: Content Management (Admin) & Advanced Features (Sprint 11-12 - ~2 Weeks)

**Objective:** Empower content creators and refine user/admin experience.

1.  **Sanity Studio Enhancements:**
    *   Refine Desk Structure for intuitive content management.
    *   Add validation rules to schemas.
    *   Configure previews if feasible.
2.  **Content Management (Instructor/Admin Interface):**
    *   For NaijaLearn, primary content creation is via Sanity Studio.
    *   Protected routes (`/admin`) in the Next.js app.
    *   Links to relevant sections in Sanity Studio.
    *   **View Student Progress (Optional but valuable):**
        *   If instructors need to see progress for *their* courses:
            *   Supabase RLS needs to be carefully designed. Add an `instructor_id` to courses in Supabase (if mirroring some course data) or a separate mapping.
            *   Admin/Instructor dashboard page to list their courses and view aggregated student enrollment/progress (read-only for progress data).
3.  **Enhancements from PRD:**
    *   **User Auth:** Social logins (Supabase supports Google, Facebook etc. - requires configuration). Email verification.
    *   **Course Nav:** Advanced search (e.g., using Supabase full-text search if course metadata is synced, or more complex client-side if not too large). Course recommendations (basic: "users who enrolled in X also enrolled in Y"). Bookmarking/favorites (Supabase table: `bookmarks` (user_id, course_id)).
    *   **Lesson Content:** Rich media (ensure Sanity schemas support this well). Interactive text highlights (could be complex, assess ROI).
    *   **Quiz:** Various question types (True/False, Matching - extend Sanity `question` schema and `QuizPlayer` component). Quiz timing. Retry.
    *   **Progress:** Achievements/badges (Supabase: `achievements` table, `user_achievements` table. Logic to award badges).

---

### Phase 5: Refinement, Testing, Optimization & Deployment (Sprint 13-14 - ~2 Weeks)

**Objective:** Polish the application, ensure quality, and prepare for launch.

1.  **Comprehensive Testing:**
    *   **Unit Tests (Jest, React Testing Library):** For critical components, utility functions, Redux slices.
    *   **Integration Tests:** Test interactions between components, client-server interactions (mock Supabase/Sanity calls).
    *   **End-to-End Tests (Cypress/Playwright):** Cover key user flows (auth, enrollment, lesson completion, quiz taking).
2.  **Performance Optimization:**
    *   Analyze bundle size (Next.js Bundle Analyzer).
    *   Optimize images (`next/image`, WebP format).
    *   Lazy load components (`next/dynamic`) and offscreen images/videos.
    *   Review SSR/SSG/ISR strategies for pages.
    *   Optimize Supabase queries (use indexes, select only needed columns).
    *   Optimize Sanity GROQ queries.
    *   Aim for Lighthouse scores > 90.
3.  **Accessibility (A11Y):**
    *   Audit against WCAG 2.1 AA.
    *   Ensure keyboard navigability for all interactive elements.
    *   Semantic HTML. ARIA attributes where necessary.
    *   Color contrast checks. Alt text for all images from Sanity.
    *   Test with screen readers.
4.  **Responsive Design Review:**
    *   Thorough testing across various devices (desktop, tablet, mobile) and orientations.
    *   Ensure all interactive elements are touch-friendly.
5.  **Security Hardening:**
    *   Review Supabase RLS policies.
    *   Ensure all API Routes/Server Actions have proper auth checks.
    *   Implement CSRF protection if custom form submissions to API routes are extensive.
    *   Set up Content Security Policy (CSP) headers.
    *   Check for OWASP Top 10 vulnerabilities.
6.  **Final Documentation:**
    *   Update `README.md` with setup, architecture overview, deployment instructions.
    *   Document Sanity schema definitions and Supabase schema/RLS.
7.  **Deployment to Vercel:**
    *   Ensure all environment variables are correctly set in Vercel for production.
    *   Configure custom domain.
    *   Monitor initial deployment for any issues.

---

### Cross-Cutting Concerns (Continuous Effort Throughout All Phases):

*   **Error Handling:** Implement robust error handling (try-catch, error boundaries in React) and user-friendly feedback (e.g., toast notifications using a library like `react-hot-toast`).
*   **State Management (Redux):** Use for global UI states, auth session, and potentially cached data that's frequently accessed or complex. Avoid overusing for local component state (use `useState`, `useReducer`).
*   **TypeScript:** Maintain strict type safety. Define clear interfaces/types in `types/` for API responses, Sanity objects, Supabase table rows.
*   **Code Quality:** Regular linting (ESLint), formatting (Prettier). Code reviews.
*   **Secrets Management:** Use Vercel environment variables for all API keys and sensitive credentials.
*   **Asynchronous Operations:** Consistently use `async/await` and manage loading/error states for data fetching. Consider `swr` or `react-query` if data fetching patterns become complex, though Next.js 15 `fetch` with Server Components handles many caching cases well.

---

**LLM-Assisted Development Strategy Integration:**

*   **Component Scaffolding:** Use LLM to generate initial boilerplate for React components, Sanity schemas, Supabase RLS policies based on defined patterns.
*   **Utility Functions:** Generate helper functions (e.g., date formatting, string manipulation).
*   **GROQ/SQL Queries:** Assist in drafting complex queries.
*   **Documentation:** Help generate JSDoc comments or initial drafts for README sections.
*   **Test Case Ideas:** Suggest test cases for components and logic.
*   **Debugging Assistance:** Explain error messages or suggest solutions.
*   **Code Conversion/Refactoring:** Assist in adapting snippets or refactoring for better practices.

**Key: All LLM-generated code MUST be reviewed, understood, and tested by a human developer.**

This action plan provides a roadmap. Flexibility will be needed, and priorities might shift based on development velocity, challenges encountered, and feedback. Regular sprint planning, reviews, and retrospectives will be crucial.