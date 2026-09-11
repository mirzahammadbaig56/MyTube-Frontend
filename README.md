# MyTube — Frontend

The React frontend for **MyTube**, a full-stack, YouTube-inspired video-sharing platform. This client consumes the [MyTube backend API](#) and provides a complete video-platform experience — authentication, video playback, uploads, social interactions, and channel management.

**Live Demo:** [add your deployed frontend URL]
**Backend Repo:** [add your backend repo link]

---

## 🚀 Features

- **Authentication** — Register, login (via username or email), logout, with automatic access-token refresh on expiry
- **Video** — Browse (with pagination and debounced search), watch, upload (with progress bar and client-side size validation), edit, delete, and toggle publish status
- **Engagement** — Like/unlike videos, add/edit/delete comments (paginated), subscribe/unsubscribe to channels
- **Channels** — Public channel profile pages with banner, avatar, subscriber count, and uploaded videos
- **Personal Library** — Watch history, liked videos, playlists (create, edit, delete, add/remove videos)
- **Community** — Short-form text posts (tweets) with edit/delete
- **Creator Tools** — Dashboard with channel statistics (views, subscribers, likes) and video management
- **Profile Management** — Update account details, avatar, cover image, and password
- **Polish** — Toast notifications, skeleton loading states, responsive design across all pages, protected routes for authenticated-only actions

---

## 🛠️ Tech Stack

| Category | Technology |
|---|---|
| Framework | React (Vite) |
| Routing | React Router DOM |
| HTTP Client | Axios (with interceptor-based token refresh) |
| Styling | Tailwind CSS |
| State Management | React Context API |
| Notifications | react-hot-toast |

---

## 📁 Project Structure

```
src/
  api/            → Axios instance + per-resource API call functions
  components/     → Reusable UI (Navbar, VideoCard, ProtectedRoute)
  context/        → AuthContext (global auth state)
  pages/          → Route-level pages (Home, VideoPage, Dashboard, etc.)
  App.jsx         → Route definitions
  main.jsx        → App entry point, providers
```

---

## ⚙️ Getting Started

### Prerequisites
- Node.js (v18+)
- The [MyTube backend](#) running locally or deployed

### Installation

```bash
git clone <this-repository-url>
cd mytube-frontend
npm install
```

### Configuration

Update the `baseURL` in `src/api/axiosInstance.js` to point to your backend:

```js
const axiosInstance = axios.create({
  baseURL: "http://localhost:8000/api/v1", // or your deployed backend URL
  withCredentials: true,
});
```

### Run the project

```bash
npm run dev
```

The app will be available at `http://localhost:5173`.

---

## 🧠 Key Engineering Highlights

- **Automatic token refresh** — an Axios response interceptor transparently refreshes an expired access token and retries the failed request, without disrupting the user's session.
- **Race-condition-safe auth bootstrapping** — on every app load, a silent token refresh completes *before* any route renders, preventing stale-token reads (e.g. a video's like/subscribe status) right after a page reload.
- **Debounced search** — the navbar search auto-navigates to results 500ms after the user stops typing, avoiding excessive requests on every keystroke.
- **Optimistic UI updates** — likes and subscriptions update instantly in the UI while the request completes in the background, with rollback-safe error handling via toasts.
- **Client-side validation** — file size checks before upload (matching backend/Cloudinary limits) give immediate feedback instead of a wasted upload attempt.

---

## 🔗 Related

This frontend is built to work with the [MyTube backend](#) — a Node.js/Express/MongoDB REST API. See that repository for full API documentation.

---

## Author

**Mirza Hammad Baig** — Software Engineering student, self-directed full-stack developer.