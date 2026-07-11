# InkWeave — Modern Real-Time Blogging Platform

**InkWeave** is a modern, responsive, and reactive blogging platform built with **React 19**, **Redux Toolkit**, **Tailwind CSS v4**, and **Appwrite Cloud** as a Backend-as-a-Service (BaaS). 

Featuring a fully reactive, real-time database syncing system, InkWeave updates stats like article likes, creation, and deletions instantly across all open browser instances without reloading.

---

## ⚡ Core Features

- 🔒 **Secure Authentication**: Complete sign-up, login, and session persistence powered by Appwrite Auth.
- ✍️ **Rich Text Editor**: Integrated with **TinyMCE** for writing styled blog posts, complete with full formatting controls.
- 🔄 **Real-Time Synchronization**: Live database subscriptions via **Appwrite Realtime** keep likes, edits, and newly created posts updated instantly across all users' feeds.
- 🎨 **Dynamic Cover Images**: Seamless cover photo uploads to Appwrite Storage with robust fallback loaders.
- 👤 **Creator Profile Dashboard**: A dedicated writer page showcasing published article counts and total accumulated likes.
- 🌓 **Global Dark & Light Theme**: Toggle mode that triggers fluid transitions across the entire application interface.
- 🔍 **Live Search & Pagination**: Instantly search articles by titles or keywords and explore feeds with pagination.
- 🛡️ **Self-Healing Schema Support**: Robust, defensive code mappings that dynamically adapt to spelling and casing variations in your database collection attributes (`userID`/`userId`, `featuredImage`/`featuredimage`, and `likes`/`Likes`/`like`).

---

## 🛠️ Tech Stack & Architecture

- **Frontend Core**: [React 19](https://react.dev/) & [Vite](https://vite.dev/)
- **State Management**: [Redux Toolkit](https://redux-toolkit.js.org/) & [React-Redux](https://react-redux.js.org/)
- **Routing**: [React Router v7](https://reactrouter.com/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Backend Services (BaaS)**: [Appwrite Web SDK](https://appwrite.io/) (Authentication, JSON Databases, Object Storage, and WebSockets Realtime API)
- **Rich Text Composing**: [TinyMCE React](https://www.tiny.cloud/)

---

## 🚀 Getting Started

### Prerequisites

Make sure you have [Node.js](https://nodejs.org/) installed.

### Installation

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/your-username/ReactBlog.git
   cd ReactBlog/react-blog
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables**:
   Create a `.env` file inside the `react-blog` directory and paste your Appwrite project configuration:
   ```env
   VITE_APPWRITE_URL="https://cloud.appwrite.io/v1"
   VITE_APPWRITE_PROJECT_ID="your_project_id"
   VITE_APPWRITE_DATABASE_ID="your_database_id"
   VITE_APPWRITE_COLLECTION_ID="your_collection_id"
   VITE_APPWRITE_BUCKET_ID="your_storage_bucket_id"
   ```

4. **Launch the Development Server**:
   ```bash
   npm run dev
   ```
   Open `http://localhost:5173/` in your browser to view the application!

5. **Build for Production**:
   ```bash
   npm run build
   ```

---

## 🔒 Database & Storage Setup in Appwrite

To configure the Appwrite database collection correctly for InkWeave, set up these settings in your console:

### 1. Database Attributes
Create the following attributes in your database Blog collection:
- `title` (String, Size: 255, Required)
- `content` (String, Size: 100000, Required)
- `featuredImage` (String, Size: 255, Optional)
- `status` (String, Size: 255, Required)
- `userID` (String, Size: 255, Required)
- `author` (String, Size: 255, Optional)
- `likes` (String, Array: **Yes**, Size: 5000, Optional)

### 2. Permissions Settings
- **Collection level**:
  - Grant **Any** (or **Users**) the **Read** permission so readers can explore posts.
  - Grant **Any** (or **Users**) the **Update** permission so users can liked/unlike posts.
- **Storage Bucket level**:
  - Grant **Any** the **Read** permission so browsers can render cover image files publicly.
