# NaijaLearn: Interactive Nigerian Cultural Learning Platform
## Enhanced Project Requirements Document

## 1. Project Overview

### 1.1 Introduction
NaijaLearn is a full-featured, scalable, and user-friendly e-learning platform dedicated to Nigerian culture. It will provide an engaging and educational experience for users interested in learning about Nigeria's rich cultural heritage, including languages, traditions, history, cuisine, and arts. The platform will achieve this through structured educational content, diverse interactive elements, and robust user engagement features.

### 1.2 Project Vision
To create an accessible, interactive, and comprehensive platform that educates a global audience about Nigerian culture. NaijaLearn will empower users to browse, enroll in, and complete courses, while instructors/admins can create, manage, and publish rich course content. The platform will serve as a premier educational resource and an impressive portfolio piece showcasing advanced, responsive web development skills using modern technologies.

### 1.3 Target Audience
*   International users interested in Nigerian culture.
*   Nigerian diaspora seeking to connect with their heritage.
*   Students of African studies, cultural anthropology, or related fields.
*   Educators seeking resources for teaching about Nigerian or African culture.
*   Tourists planning to visit Nigeria or interested in its cultural context.
*   Anyone curious about Nigeria's diverse cultural landscape.

### 1.4 Core Platform Objectives
*   Develop a full-featured, scalable, and user-friendly e-learning platform.
*   Enable users to browse, enroll in (free for MVP), and complete courses.
*   Allow instructors/admins to create, manage, and publish course content via a headless CMS.
*   Provide an engaging learning experience through text, video, downloadable resources, and interactive quizzes.
*   Track user progress and offer a personalized dashboard.
*   Ensure the platform is fully responsive and accessible across all devices.

## 2. Technology Stack

*   **Frontend Framework:** Next.js 15 (utilizing the App Router).
*   **Styling:** Tailwind CSS v4. (Utilize latest stable v4 features. If experimental features cause issues, adapt using stable Tailwind patterns or v3 conventions, with clear documentation).
*   **State Management:** Redux (Redux Toolkit highly preferred for slices, Immer, and simplified setup).
*   **Deployment:** Vercel.
*   **Backend & Database (BaaS):** Supabase
    *   Authentication: User management (email/password, optional social logins), Row Level Security (RLS).
    *   Database: Storing user profiles, course enrollments, lesson progress, quiz results.
    *   Storage: For user profile pictures and potentially instructor-uploaded course materials not directly handled by Sanity (e.g., large supplementary files).
*   **Content Management System (CMS):** Sanity.io
    *   For creating and managing all course content: courses, modules, lessons (including rich text, video URLs, resource links), quiz questions, and answers.
*   **Interactive Component Libraries (as needed, ensuring compatibility):**
    *   `@dnd-kit/core` for drag-and-drop interactions (e.g., cultural matching games).
    *   `Framer Motion` for sophisticated animations and transitions.
    *   `react-leaflet` (or similar, e.g., Mapbox GL JS with React wrapper) for interactive maps.
*   **Icons:** Lucide Icons or Heroicons for a consistent visual language.

## 3. Core Platform Functionalities

These functionalities form the backbone of the e-learning experience.

### 3.1 User Authentication & Profiles
*   **Secure User Registration:** Email/password, optional social logins (Google, Facebook via Supabase).
*   **User Login & Logout:** Secure session management.
*   **Password Recovery:** "Forgot password" flow.
*   **User Profile Page:**
    *   View/edit basic information (name, bio).
    *   Upload/change profile picture (stored in Supabase Storage).
    *   (Enhancement) Cultural interest selection.
*   **Protected Routes:** For authenticated users (e.g., dashboard, course consumption).

### 3.2 Course Discovery & Enrollment
*   **Homepage:**
    *   Hero section with engaging headline and CTA.
    *   Display featured courses and categories (e.g., "Languages," "History," "Cuisine").
    *   Prominent search bar for courses.
*   **Course Listing Page (`/courses`):**
    *   Comprehensive list of all available courses.
    *   Filtering options (by category, difficulty, instructor – if applicable).
    *   Sorting options (e.g., newest, most popular).
    *   `CourseCard` components displaying thumbnail, title, brief description.
*   **Detailed Course Pages (`/courses/[slug]`):**
    *   Comprehensive course description, learning objectives.
    *   Curriculum: Structured display of modules and lessons (e.g., using accordions).
    *   Instructor information (bio, picture – managed in Sanity).
    *   (Optional, post-MVP) User reviews and ratings.
    *   Clear enrollment options (MVP: focus on free enrollment).
*   **User Enrollment:** Users can enroll in courses. Enrollment status stored in Supabase.

### 3.3 Course Consumption
*   **Structured Course Content:**
    *   **Modules:** Thematic grouping of lessons.
    *   **Lessons:** Contain various content types:
        *   Rich Text (via Sanity Portable Text, rendered with `@portabletext/react`).
        *   Embedded Videos (YouTube, Vimeo URLs managed in Sanity).
        *   Downloadable Resources (PDFs, links managed in Sanity).
*   **Interactive Quizzes:** Integrated within or at the end of modules/lessons.
*   **User Progress Tracking:**
    *   Mark lessons/modules as completed.
    *   Store quiz scores and attempts.
    *   Visual progress indicators (e.g., progress bars).
*   **Navigation:** Easy navigation between lessons and modules within a course ("Previous," "Next"). Sidebar for course structure overview.

### 3.4 User Dashboard (`/dashboard`)
*   **View Enrolled Courses:** List of courses the user is enrolled in, with their current progress.
*   **Resume Learning:** Quick links to resume courses from the last viewed lesson.
*   **Access to Profile Settings.**
*   **(Optional Enhancement)** Achievements, badges, or certificates of completion.

### 3.5 Content Management (Instructor/Admin via Sanity Studio)
*   **Sanity Studio Interface:** A separate, user-friendly interface for content creators.
*   **Course Creation & Management:**
    *   Create, edit, publish, and unpublish courses.
    *   Define course metadata: title, slug, description, category, difficulty, instructor, thumbnail.
*   **Module & Lesson Management:**
    *   Structure courses into modules.
    *   Create, edit, and arrange lessons within modules.
    *   Manage lesson content types: rich text, video URLs, resource links/uploads.
*   **Quiz & Question Management:**
    *   Create quizzes with titles and associate them with lessons/modules.
    *   Manage quiz questions: text, type (multiple choice, true/false initially), options, correct answer(s).
*   **(Optional Enhancement for Platform Admins)** View student enrollment and high-level progress analytics (requires custom integration between Supabase data and Sanity, or a separate admin dashboard).

### 3.6 Quiz System
*   **Quiz Creation (in Sanity):** Define quizzes with multiple-choice questions, options, and correct answers.
*   **Quiz Consumption (in Next.js):**
    *   Display quiz questions and options clearly.
    *   Allow users to select answers.
    *   Submit answers and receive immediate feedback (correct/incorrect) and scores.
*   **Data Storage (in Supabase):** Store quiz attempts, user answers, and final scores.

### 3.7 Responsive Design
*   The application must be fully responsive and provide an optimal user experience on desktop, tablet, and mobile devices, adhering to Tailwind CSS best practices for breakpoints.

## 4. NaijaLearn-Specific Interactive Components

These components will enhance the cultural learning experience, built using the core tech stack.

### 4.1 Language Pronunciation Tool
*   **Initial Implementation:**
    *   Display list of Nigerian words/phrases (e.g., common greetings in Yoruba, Igbo, Hausa) managed in Sanity.
    *   Audio playback for each word/phrase (audio files linked in Sanity).
    *   Simple pronunciation guide text.
*   **Enhancement Path:** Phonetic transcriptions, playback speed control, categorization, user recording/playback for practice.
*   **Technical Considerations:** Accessible audio controls (`<audio>` element), optimized audio file loading, responsive UI.

### 4.2 Interactive Map of Nigeria
*   **Initial Implementation:**
    *   Display a map of Nigeria using `react-leaflet` or similar.
    *   Highlight major regions or states.
    *   Tooltips with basic information (name, key cultural fact) on hover/click. Data sourced from Sanity.
*   **Enhancement Path:** Detailed information pop-ups, cultural highlight overlays (festivals, historical sites), zoom/pan controls, location-specific media content.
*   **Technical Considerations:** Optimized map rendering, responsive map controls, efficient data fetching for map markers/info from Sanity, accessibility for map interactions.

### 4.3 Drag-and-Drop Cultural Matching Game
*   **Initial Implementation:**
    *   Simple matching exercise (e.g., Nigerian foods to their names, cultural artifacts to regions).
    *   Use `@dnd-kit/core`.
    *   Basic visual feedback on correct/incorrect matches. Content (items, matches) managed in Sanity.
*   **Enhancement Path:** Various activity types, scoring, timed challenges, difficulty levels, richer visual/audio feedback.
*   **Technical Considerations:** Touch and mouse compatibility, keyboard accessibility for drag-drop, responsive layout for activity, smooth animations with Framer Motion.

### 4.4 Nigerian Cuisine Recipe Explorer (Simplified "Simulator")
*   **Initial Implementation:**
    *   Display Nigerian recipes: title, description, image, ingredients, step-by-step instructions. Content managed in Sanity.
    *   Clear, readable layout for recipe steps.
*   **Enhancement Path:** Interactive ingredient checklist, embedded videos for cooking techniques, unit conversion, user ratings/comments on recipes.
*   **Technical Considerations:** Structured recipe data in Sanity (portable text for steps, array for ingredients), responsive display, optimized image loading.

## 5. UI Design Description

*(Adapted from the "Modern E-Learning Platform" prompt, with potential NaijaLearn flavor)*

### 5.1 Overall Aesthetic
*   **Modern, Clean & Culturally Infused:** Professional and uncluttered, with subtle design cues that evoke Nigerian artistry or aesthetics (e.g., patterns, color accents).
*   **Intuitive & User-Friendly:** Straightforward navigation and interactions.
*   **Engaging & Inviting:** Encourages learning, exploration, and appreciation of Nigerian culture.

### 5.2 Color Palette
*   **Primary:** A trustworthy blue (e.g., `#3B82F6` - Tailwind's `blue-500`) or a deep, earthy tone (e.g., a rich terracotta or forest green, reflecting Nigerian landscapes/art).
*   **Secondary:** A light gray (e.g., `#F3F4F6` - Tailwind's `gray-100`) for backgrounds or a complementary lighter shade of the primary.
*   **Accent:** Vibrant colors inspired by Nigerian textiles or nature for CTAs and highlights (e.g., a warm yellow like `FBBF24` - Tailwind's `amber-400`, or a bright green like `#10B981` - Tailwind's `green-500`).
*   **Text:** Dark gray/black for body text (e.g., `#1F2937` - Tailwind's `gray-800`), lighter shade for secondary text.
*   **Feedback Colors:** Standard green for success, red for errors, yellow for warnings.

### 5.3 Typography
*   **Headings:** Clean sans-serif (e.g., Inter, Montserrat, Manrope). Consider a display font with African influence for major titles if used sparingly and legibly.
*   **Body Text:** Highly readable sans-serif (e.g., Inter, Open Sans, Lato).
*   **Line Height & Spacing:** Ample for readability.

### 5.4 Layout & Structure (General Principles)
*   **Responsive:** Fluid grid, adapting to all screen sizes. Mobile-first approach.
*   **Navigation:**
    *   **Main Navigation (Top Bar):** Logo (NaijaLearn), links (Home, Courses, Categories, About Us - optional), Search Icon, User Profile/Login/Signup.
    *   **Course View Sidebar:** Navigation for modules/lessons within a course. Collapsible.
*   **Consistency:** Uniform padding, margins, component styles.
*   **Whitespace:** Effective use to reduce clutter and improve focus.

### 5.5 Key Screens & Components (Examples)
*   **Homepage:** Hero, featured courses (`CourseCard`), category links, search.
*   **Course Listing Page (`/courses`):** Filters, sort, grid/list of `CourseCard`s.
*   **Course Detail Page (`/courses/[slug]`):** Rich description, curriculum (modules/lessons), instructor bio, enrollment CTA.
*   **Lesson View Page (`/courses/[courseSlug]/lessons/[lessonSlug]`):** Main content area (text, video, resources), lesson navigation, progress markers, course structure sidebar.
*   **Quiz Page:** Question display, options (radio/checkbox), submit, feedback, progress.
*   **User Dashboard (`/dashboard`):** "My Enrolled Courses" (with progress), resume links, profile access.
*   **Auth Pages:** Clean, centered forms with clear CTAs.
*   **Common UI Elements:**
    *   **Buttons:** Primary, secondary, tertiary styles with hover/active/focus states.
    *   **Cards:** For courses, modules, interactive elements.
    *   **Forms:** Well-structured, clear labels, validation messages (e.g., using React Hook Form).
    *   **Modals:** For confirmations, quick views.
    *   **Toast Notifications:** For non-intrusive feedback (e.g., using `react-hot-toast`).
    *   **Loading States:** Skeletons, spinners.
    *   **Icons:** Consistent set (Lucide Icons recommended).

### 5.6 Interactivity & Microinteractions
*   Smooth transitions (Framer Motion where appropriate).
*   Visual feedback on actions.
*   Dynamic progress updates.

### 5.7 Accessibility (A11Y)
*   Strive for WCAG 2.1 AA compliance.
*   Good color contrast, keyboard navigation, ARIA attributes, alt text, semantic HTML.

## 6. Key Technical Requirements & Best Practices

### 6.1 General Principles
*   **Incremental Development:** Build iteratively, slice by slice.
*   **Modularity:** Reusable components (`components/ui/`, `components/features/`).
*   **Clean Code:** Well-documented, meaningful names, consistent style (ESLint, Prettier).
*   **Error Handling:** Robust client/server error handling, user-friendly messages.
*   **Security First:** Input validation, protected routes/APIs, RLS, environment variables for secrets.
*   **Performance:** Optimize for speed (lazy loading, code splitting, efficient data fetching).

### 6.2 Next.js 15 Specifics
*   **App Router:** Structure using `app/` directory.
*   **Server & Client Components:** Judicious use. Server Components for data fetching/static parts, Client Components for interactivity.
*   **API Routes/Server Actions:** For custom backend logic interacting with Supabase securely.
*   **Data Fetching:** `fetch` in Server Components/Route Handlers. Caching strategies (Next.js fetch cache, ISR).
*   **TypeScript:** Use throughout for type safety. Define clear interfaces (`types/`).

### 6.3 Tailwind CSS v4 Specifics
*   **Utility-First:** Embrace the approach.
*   **v4 Features:** Utilize stable v4 features. Document any workarounds for experimental features.
*   **Configuration:** Customize `tailwind.config.ts` (theme, colors, fonts).
*   **Responsive Design:** Implement using Tailwind's breakpoints.

### 6.4 Redux Toolkit Specifics
*   **State Slices:** Organize state logically (e.g., `authSlice`, `uiSlice`, `courseProgressSlice`, `quizSlice`).
*   **Provider:** Wrap application in `app/layout.tsx`.
*   **Usage:** Global UI state, client-side auth status, cached data, complex form states. Avoid for purely local state.
*   **Typed Hooks:** `useAppDispatch`, `useAppSelector`.

### 6.5 Supabase Specifics
*   **Client:** Use `@supabase/supabase-js`. Initialize via `lib/supabaseClient.ts`.
*   **Authentication:** Email/password, social logins. Extend `auth.users` with a `profiles` table (public schema) for additional user data (bio, avatar_url, cultural_interests).
*   **Database Schema (Illustrative):**
    *   `profiles` (user_id (fk to auth.users.id), full_name, avatar_url, bio, cultural_interests_array)
    *   `enrollments` (id, user_id, course_sanity_id (text, refers to Sanity course ID), enrolled_at, progress_percentage)
    *   `lesson_progress` (id, enrollment_id, lesson_sanity_id, status (e.g., 'not_started', 'in_progress', 'completed'), completed_at)
    *   `quiz_attempts` (id, user_id, quiz_sanity_id, lesson_sanity_id (optional), score, submitted_at, answers_json)
*   **Row Level Security (RLS):** Enable on ALL tables. Policies to ensure users only access/modify their own data. Admins might have broader (but still secure) access via service_role key used in Server Actions/API Routes.
*   **Server-Side Operations:** Perform writes/updates/deletes via Next.js Server Actions or API Routes using Supabase service_role key for security.
*   **Storage:** For profile pictures, potentially large course resources. Secure with RLS policies.

### 6.6 Sanity.io Specifics
*   **Studio Setup (`sanity/` directory):**
    *   Define clear schemas:
        *   `course`: title, slug, description, category (e.g., "Language", "History"), mainImage, instructor (reference to `instructor` type), modules (array of references to `module`), difficulty.
        *   `instructor`: name, bio, image.
        *   `module`: title, slug, lessons (array of references to `lesson`).
        *   `lesson`: title, slug, content (portable text), videoUrl (string, URL), downloadableResources (array of files or objects with title/URL), quiz (reference to `quiz`).
        *   `quiz`: title, description, questions (array of references to `question`).
        *   `question`: text, questionType ('multipleChoice', 'trueFalse'), options (array of objects: {text: string, isCorrect: boolean}), explanation (portable text, optional).
        *   NaijaLearn Specific Schemas: `languagePhrase` (text, phonetic, audioFile, meaning), `mapLocation` (name, coordinates, description, culturalSignificance, media), `culturalItem` (name, description, image, category for matching games), `recipe` (title, description, image, ingredients (array of strings/objects), steps (portable text)).
*   **Client:** Use `@sanity/client` (or a modern alternative like `next-sanity`) for fetching data in Next.js. Initialize in `lib/sanityClient.ts`.
*   **GROQ:** Use efficient GROQ queries.
*   **Image Handling:** `@sanity/image-url` for responsive images.
*   **Portable Text:** Render with `@portabletext/react`, customizing components as needed.

### 6.7 Security Requirements
*   Implement Supabase RLS thoroughly.
*   Validate all user inputs (client and server-side).
*   Protect API routes/Server Actions with auth checks.
*   Securely manage API keys (Supabase, Sanity) via Vercel environment variables (`process.env`).
*   Use HTTPS (default on Vercel).
*   Implement CSRF protection if using traditional forms alongside Server Actions.
*   Content Security Policy (CSP) headers.
*   Rate limiting on sensitive endpoints (auth, form submissions).
*   Regular dependency audits (e.g., `npm audit`).

### 6.8 Performance Optimization
*   SSR/SSG/ISR with Next.js. ISR for course lists, SSG for individual course pages if content changes infrequently, SSR for dynamic user-specific pages.
*   Code splitting (automatic with Next.js App Router).
*   Lazy loading for images (`next/image`), components (`next/dynamic`), and offscreen content.
*   Optimize Sanity GROQ queries to fetch only necessary data.
*   Bundle size analysis (e.g., `@next/bundle-analyzer`).
*   Effective caching.

### 6.9 Accessibility Requirements
*   Adhere to WCAG 2.1 Level AA guidelines.
*   Semantic HTML, ARIA attributes, keyboard navigability, focus management, sufficient color contrast, alt text for all meaningful images.
*   Test with screen readers and keyboard-only navigation.

## 7. Project Structure & Organization

*   **`app/`:** Next.js App Router (routes, layouts, pages, loading, error, server/client components).
    *   `app/(auth)/` for login, signup, password-reset routes.
    *   `app/(platform)/` for core app routes (dashboard, courses, etc.) requiring auth.
*   **`components/`:**
    *   `ui/`: Generic UI elements (Button, Card, Input, Modal, etc. – potentially adapted from ShadCN/UI or built custom with Tailwind v4).
    *   `features/`: Feature-specific components (e.g., `CourseCard`, `QuizPlayer`, `LessonNavigator`, `InteractiveMap`).
    *   `auth/`: Authentication-related components (LoginForm, SignupForm).
*   **`lib/`:** Utility functions, Supabase/Sanity client initializations, helper functions, constants.
*   **`store/`:** Redux store setup (`store.ts`), slices (`features/`), typed hooks (`hooks.ts`).
*   **`sanity/`:** Sanity Studio configuration files (schemas, `sanity.config.ts`, `sanity.cli.ts`).
*   **`types/`:** Global TypeScript type definitions and interfaces (e.g., `Course`, `Lesson`, `User`, `QuizAttempt`).
*   **`public/`:** Static assets (e.g., favicon, placeholder images).
*   **`prisma/` (if using Prisma with Supabase, optional) or `supabase/migrations/` for DB schema.**

## 8. Deliverables

*   A fully functional NaijaLearn e-learning application deployed on Vercel.
*   Source code hosted in a Git repository (e.g., GitHub, GitLab).
*   A comprehensive `README.md` file:
    *   Project overview and purpose.
    *   Detailed setup instructions (environment variables, Sanity setup, database migrations if any).
    *   Overview of the project architecture and key directories.
    *   Instructions for running the development server and building the project.
*   Sanity Studio:
    *   Configuration files and all schema definitions (`.ts` or `.js` files).
    *   Instructions on how to deploy or run the Sanity Studio locally.
*   Supabase:
    *   Database schema definitions (SQL migration files, or clear descriptions if managed via Supabase UI initially).
    *   RLS policies documented or included as SQL.

## 9. Implementation Approach & Development Workflow

### 9.1 Modified Vertical Slice Methodology
Implement end-to-end features incrementally, starting with core functionality and then enhancing each slice.
1.  **Foundation:** Project setup, core layout, basic navigation.
2.  **Authentication:** User registration, login, profile basics.
3.  **Sanity Setup & Content Modeling:** Define schemas, populate sample data.
4.  **Course Display:** Fetch and display courses/lessons from Sanity.
5.  **Enrollment & Basic Progress:** Implement course enrollment, track lesson completion (client-side initially, then Supabase).
6.  **Basic Quizzes:** Quiz display, submission, simple feedback (no DB storage initially).
7.  **Supabase Integration for Progress & Quizzes:** Persist progress and quiz results.
8.  **User Dashboard:** Display enrolled courses and progress.
9.  **NaijaLearn Interactive Components:** Develop language tool, map, cultural matching, recipe explorer one by one.
10. **Admin/Instructor Interface (Sanity Focus):** Ensure Sanity Studio is robust for content management.
11. **Styling, Refinement & Accessibility:** Consistent Tailwind styling, A11Y audit.
12. **Testing & Optimization:** Implement testing strategy, performance tuning.
13. **Deployment:** Continuous deployment to Vercel.

### 9.2 Development Phases (High-Level)

**Phase 1: Core Infrastructure & Authentication (MVP Focus)**
*   Next.js 15 project setup (App Router, TS, Tailwind v4, Redux Toolkit).
*   Supabase project setup, basic `profiles` table, email/password auth.
*   Sanity project setup, initial schemas for `course`, `module`, `lesson`.
*   Basic layout, navigation components.
*   User registration, login, logout, protected routes.
*   Basic User Profile page.

**Phase 2: Course Content Delivery & Basic Interaction (MVP Focus)**
*   Fetching and displaying course lists and individual course/lesson pages from Sanity.
*   Rendering lesson content (text, embedded video).
*   Client-side lesson completion marking.
*   Basic Quiz display and interaction (multiple choice, client-side feedback).
*   User Dashboard MVP: display enrolled courses (mocked/simple enrollment).
*   Free course enrollment logic (linking user to course_sanity_id in Supabase).
*   Storing lesson progress and quiz attempts in Supabase.

**Phase 3: NaijaLearn Specific Interactivity & Enhancements**
*   Develop core interactive elements: Language Pronunciation Tool, Interactive Map, Drag-and-Drop Game, Recipe Explorer (phased).
*   Enhance Quiz System: store attempts/scores in Supabase, varied question types.
*   Refine User Dashboard with actual progress data.
*   Implement social logins.
*   Password recovery flow.

**Phase 4: Refinement, Optimization, Testing & Polish**
*   Comprehensive styling and responsive design review.
*   Performance optimization (Lighthouse scores).
*   Accessibility audit and fixes (WCAG 2.1 AA).
*   Robust error handling and user feedback (toast notifications).
*   Cross-browser testing.
*   Writing unit, integration, and E2E tests.
*   Finalize README and documentation.

### 9.3 LLM-Assisted Development Strategy
*   Utilize this comprehensive PRD as the primary input for generating code scaffolds, components, and logic.
*   Request code based on specific sections (e.g., "Generate a Next.js Server Component to fetch and display a course list from Sanity using GROQ").
*   Define clear API contracts for components and functions when prompting.
*   Iteratively refine generated code, focusing on adherence to best practices outlined herein.

## 10. Testing Strategy

*   **Unit Testing (Jest, React Testing Library):**
    *   Individual React components (UI and feature components).
    *   Redux reducers/slices, actions, and selectors.
    *   Utility functions in `lib/`.
    *   Hooks.
*   **Integration Testing (React Testing Library, MSW for API mocking):**
    *   Interaction between multiple components (e.g., form submission, course enrollment flow).
    *   Client-side interaction with mocked Sanity/Supabase responses.
    *   Redux store integration with components.
*   **End-to-End Testing (Cypress or Playwright):**
    *   Critical user flows: Sign up -> Login -> Browse Course -> Enroll -> View Lesson -> Take Quiz -> View Dashboard.
    *   Test responsiveness across defined breakpoints.
    *   Basic accessibility checks within E2E tests.
*   **Accessibility Testing:** Automated tools (Axe), manual keyboard navigation, screen reader testing.
*   **Linting & Formatting:** ESLint and Prettier enforced in CI.

## 11. Deployment and DevOps

*   **CI/CD:** GitHub Actions (or Vercel's built-in CI/CD) for automated testing, building, and deployment on pushes/merges to main/develop branches.
*   **Environments:**
    *   `development` (local)
    *   `preview` (Vercel preview deployments for PRs)
    *   `production` (Vercel production deployment)
*   **Environment Variables:** Managed via Vercel project settings for Supabase keys, Sanity project ID/dataset/token.
*   **Monitoring & Error Tracking:** Integrate Sentry or similar for frontend error tracking. Vercel analytics for traffic and performance.
*   **Database Backups:** Configure via Supabase.
*   **Sanity Studio Deployment:** Deploy the Sanity Studio (e.g., `sanity deploy`).

## 12. Success Metrics

### 12.1 Technical Success Metrics
*   Lighthouse Performance Score: > 90 for key pages.
*   Lighthouse Accessibility Score: > 95.
*   WCAG 2.1 AA Compliance: Verified through audits.
*   Core Web Vitals: All "Good."
*   Error Rate (Sentry): < 0.5% of sessions impacted by JS errors.
*   Test Coverage: > 80% for unit tests on critical logic/components.
*   Zero high/critical security vulnerabilities reported by automated scans/manual review.
*   Successful deployment pipeline with automated checks.

### 12.2 User Experience & Engagement Metrics
*   User Registration Rate.
*   Course Enrollment Rate.
*   Average Module/Lesson Completion Rate: > 60% for started content.
*   Quiz Completion & Average Scores.
*   Session Duration & Pages per Session.
*   User Retention Rate (e.g., users returning within 7/30 days).
*   Bounce Rate on key landing/course pages: < 40%.
*   Qualitative feedback from user surveys or feedback forms.

### 12.3 Portfolio Success Demonstration
*   Clear, well-documented codebase demonstrating proficiency in Next.js 15, Tailwind v4, Redux, Supabase, and Sanity.
*   Showcase of complex interactive components (maps, drag-and-drop).
*   Evidence of robust security (RLS) and performance optimization techniques.
*   Demonstrable commitment to accessibility standards.
*   A live, polished, and fully functional application deployed on Vercel.
