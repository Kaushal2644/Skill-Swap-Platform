# Admin Login Instructions

## How to Login as Admin

There are two ways to get admin access:

### Method 1: Register with Admin Email (Easiest)

1. Go to the registration page
2. Register with the email: `admin@skillswap.com`
3. Use any password (minimum 6 characters)
4. Complete registration
5. You will automatically have admin access!

### Method 2: Set Admin Role Manually

If you already have an account, you can manually set the admin role:

1. Open your browser's Developer Console (F12)
2. Go to the Console tab
3. Run this command:

```javascript
// Get all users
const users = JSON.parse(localStorage.getItem('users') || '[]');

// Find your user (replace 'your-email@example.com' with your actual email)
const user = users.find(u => u.email === 'your-email@example.com');

if (user) {
  // Set admin role
  user.role = 'admin';
  
  // Update localStorage
  localStorage.setItem('users', JSON.stringify(users));
  
  // Update current session
  const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
  if (currentUser.id === user.id) {
    currentUser.role = 'admin';
    localStorage.setItem('user', JSON.stringify(currentUser));
  }
  
  console.log('Admin role assigned! Please refresh the page.');
} else {
  console.log('User not found!');
}
```

4. Refresh the page
5. You should now see "Admin Dashboard" in the sidebar

## Admin Features

Once logged in as admin, you can:
- View all users and their statistics
- See all connections and messages
- Delete users
- View platform statistics (total users, connections, messages, active users)
- Access the Admin Dashboard from the sidebar

## Default Admin Account

**Email:** `admin@skillswap.com`  
**Password:** (set during registration)

Note: You can use any password when registering with the admin email - it will automatically grant admin privileges.



