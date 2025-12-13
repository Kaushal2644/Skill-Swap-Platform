# Skill Swap Platform

A modern web application for exchanging skills between users. Users can register, create profiles, list skills they can teach and skills they want to learn, and find potential skill exchange partners.

## Features

- **User Authentication**: Secure login and registration system
- **User Profiles**: Create and manage your profile with bio and skills
- **Skill Management**: Add skills you can teach and skills you want to learn
- **Skill Matching**: Find users with complementary skills automatically
- **Search & Filter**: Search users by name or skill, filter by teaching/learning preferences
- **Modern UI**: Beautiful, responsive design with gradient backgrounds

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Open your browser and navigate to `http://localhost:3000`

### Building for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

## Usage

1. **Register**: Create a new account with your name, email, and password
2. **Login**: Sign in with your credentials
3. **Profile**: Update your profile, add your bio, and list your skills
4. **Dashboard**: Browse other users and find potential skill exchange partners
5. **Match**: The platform automatically highlights potential matches based on complementary skills

## Technology Stack

- **React 18**: Frontend framework
- **React Router**: Client-side routing
- **Vite**: Build tool and development server
- **LocalStorage**: Data persistence (for demo purposes)

## Project Structure

```
src/
├── components/       # Reusable components (Navbar)
├── pages/           # Page components (Login, Register, Dashboard, Profile)
├── App.jsx          # Main app component with routing
├── main.jsx         # Entry point
└── index.css        # Global styles
```

## Notes

- User data is stored in browser localStorage for demo purposes
- In a production environment, you would use a backend API and database
- Passwords are stored in plain text for demo - use proper hashing in production

## License

MIT
