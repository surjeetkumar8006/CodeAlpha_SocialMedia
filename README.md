# NexusConnect - Modern Social Media Platform

NexusConnect is a premium, full-stack social media application featuring an interactive post feed, user profiles, liking/commenting capability, follow/unfollow updates, who-to-follow sidebar suggestions, and a bookmarking/saving filter.

## 🚀 Key Features
* **Dynamic Feed Tab Filter**: Toggle between "All Posts" feed and "Bookmarked" saved posts (stored locally in client session).
* **Interactive Likes & Comments**: Click to like posts and instantly update counts, or expand comment drawers to view/add threads.
* **"Who to Follow" Recommendations**: Sidebar showcasing recommended users dynamically based on relationship graph data.
* **Social Connections**: Live follow and unfollow buttons on recommendations cards and user profile pages.
* **Initials-Based Avatars**: Auto-generated custom profile initials badges for users lacking uploaded pictures.

## 🛠️ Tech Stack
* **Frontend**: React.js, Vite Builder, Axios Client, Lucide React Icons.
* **Backend**: Node.js, Express.js.
* **Database**: MongoDB Atlas Cloud, Mongoose Schemas.
* **Security**: JWT authorization headers, Bcrypt password hashing.

## 📁 API Endpoints

### Authentication
* `POST /api/auth/register` - Create user and generate login token.
* `POST /api/auth/login` - Verify email/password and retrieve token.

### Posts
* `GET /api/posts` - Fetch all community feed posts.
* `POST /api/posts` - Create a new text post (requires token authorization).
* `PUT /api/posts/like/:id` - Toggle like/unlike state for a post.
* `POST /api/posts/comment/:id` - Write a comment under a post.
* `GET /api/posts/comment/:id` - Retrieve comments list for a post.

### Users
* `GET /api/users` - Fetch other active users on the platform.
* `GET /api/users/:id` - Retrieve profile information of a specific user.
* `PUT /api/users/follow/:id` - Toggle follow/unfollow relationship graph.

## ⚡ Quick Start

### 1. Start Backend Server
```bash
cd backend
npm install
# Configure env parameters in .env
node server.js
```

### 2. Start Frontend Dev Server
```bash
cd frontend
npm install
npm run dev
```
Visit `http://localhost:5173` to join the feed!
