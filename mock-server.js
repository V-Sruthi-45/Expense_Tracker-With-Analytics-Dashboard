const express = require('express');
const cors = require('cors');

// In-memory storage for multiple users
const userExpenses = {
    'user1@example.com': [
        {
            _id: "1",
            description: "Grocery Shopping",
            amount: 2500,
            category: "Food & Dining",
            date: new Date("2024-01-15"),
            paymentMethod: "Credit Card",
            createdAt: new Date("2024-01-15"),
            updatedAt: new Date("2024-01-15")
        },
        {
            _id: "2",
            description: "Uber Ride",
            amount: 450,
            category: "Transportation",
            date: new Date("2024-01-16"),
            paymentMethod: "Cash",
            createdAt: new Date("2024-01-16"),
            updatedAt: new Date("2024-01-16")
        }
    ],
    'user2@example.com': [
        {
            _id: "3",
            description: "Electric Bill",
            amount: 1200,
            category: "Bills & Utilities",
            date: new Date("2024-01-17"),
            paymentMethod: "Bank Transfer",
            createdAt: new Date("2024-01-17"),
            updatedAt: new Date("2024-01-17")
        },
        {
            _id: "4",
            description: "Restaurant Dinner",
            amount: 800,
            category: "Food & Dining",
            date: new Date("2024-01-18"),
            paymentMethod: "Credit Card",
            createdAt: new Date("2024-01-18"),
            updatedAt: new Date("2024-01-18")
        }
    ]
};

// User credentials database
const userCredentials = {
    'user1@example.com': { password: 'password123', name: 'John Doe' },
    'user2@example.com': { password: 'password456', name: 'Jane Smith' }
};

let nextId = 100; // Start from 100 to avoid conflicts

const app = express();

// CORS configuration
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:8080'],
  credentials: true
}));

// Body parser middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Helper function to get user expenses
function getUserExpenses(userEmail) {
    if (!userEmail) {
        return [];
    }
    return userExpenses[userEmail] || [];
}

// Helper function to save user expenses
function saveUserExpenses(userEmail, expenses) {
    userExpenses[userEmail] = expenses;
}

// Helper function to add new user
function addUser(userEmail, name) {
    if (!userExpenses[userEmail]) {
        userExpenses[userEmail] = [];
    }
    console.log(`New user registered: ${userEmail} (${name})`);
}

// Routes
app.get('/', (req, res) => {
  res.status(200).json({ 
    message: 'Expense Tracker API (Mock Mode)',
    version: '1.0.0',
    endpoints: {
      expenses: '/api/expenses',
      analytics: '/api/analytics',
      health: '/api/health'
    },
    documentation: 'Available at /api/health',
    mode: 'Mock (No Database)'
  });
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({ 
    status: 'OK', 
    message: 'Expense Tracker API is running (Mock Mode)',
    timestamp: new Date().toISOString(),
    mode: 'Mock (No Database)'
  });
});

// Authentication endpoints
app.post('/api/auth/login', (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }
    
    // Accept any email and password - create user if doesn't exist
    const name = email.split('@')[0]; // Extract name from email
    const userName = name.charAt(0).toUpperCase() + name.slice(1); // Capitalize first letter
    
    // Create user if doesn't exist
    if (!userCredentials[email]) {
      userCredentials[email] = { password, name: userName };
      userExpenses[email] = [];
      console.log(`New user created: ${email} (${userName})`);
    }
    
    const user = userCredentials[email];
    
    res.json({
      success: true,
      user: {
        name: user.name,
        email: email,
        role: 'user'
      },
      token: 'mock-jwt-token-' + Date.now()
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/auth/signup', (req, res) => {
  try {
    const { name, email, password } = req.body;
    
    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Name, email and password are required' });
    }
    
    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters' });
    }
    
    // Create user (allow even if email exists - just update)
    userCredentials[email] = { password, name };
    if (!userExpenses[email]) {
      userExpenses[email] = [];
    }
    
    console.log(`User signed up: ${email} (${name})`);
    
    res.json({
      success: true,
      user: {
        name: name,
        email: email,
        role: 'user'
      },
      token: 'mock-jwt-token-' + Date.now()
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// OAuth endpoints (working mock implementation for testing)
app.get('/api/auth/oauth/google', (req, res) => {
  // For testing, create a working mock OAuth flow
  console.log('Google OAuth initiated');
  
  // Create a simple HTML page that simulates Google OAuth
  const mockOAuthPage = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Google OAuth Mock</title>
        <script src="https://cdn.tailwindcss.com"></script>
        <style>
            * {
                color: white !important;
            }
            
            body {
                background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
                min-height: 100vh;
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                position: relative;
                overflow: hidden;
            }
            
            body::before {
                content: '';
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: radial-gradient(circle at 20% 50%, rgba(255, 255, 255, 0.1) 0%, transparent 50%),
                            radial-gradient(circle at 80% 80%, rgba(255, 255, 255, 0.05) 0%, transparent 50%);
                pointer-events: none;
            }
            
            .glass-card {
                background: linear-gradient(145deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05));
                backdrop-filter: blur(20px);
                border: 1px solid rgba(255, 255, 255, 0.2);
                box-shadow: 
                    0 8px 32px rgba(0, 0, 0, 0.3),
                    inset 0 1px 0 rgba(255, 255, 255, 0.1);
                position: relative;
                overflow: hidden;
            }
            
            .glass-card::before {
                content: '';
                position: absolute;
                top: 0;
                left: -100%;
                width: 100%;
                height: 100%;
                background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent);
                transition: left 0.5s;
            }
            
            .glass-card:hover::before {
                left: 100%;
            }
            
            .google-btn {
                background: linear-gradient(145deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05));
                backdrop-filter: blur(10px);
                border: 1px solid rgba(255, 255, 255, 0.2);
                color: white !important;
                padding: 14px 28px;
                border-radius: 12px;
                cursor: pointer;
                margin: 10px 0;
                font-size: 16px;
                font-weight: 500;
                transition: all 0.3s ease;
                box-shadow: 
                    0 4px 16px rgba(0, 0, 0, 0.2),
                    inset 0 1px 0 rgba(255, 255, 255, 0.1);
                position: relative;
                overflow: hidden;
            }
            
            .google-btn:hover {
                background: linear-gradient(145deg, rgba(255, 255, 255, 0.2), rgba(255, 255, 255, 0.1));
                transform: translateY(-2px);
                box-shadow: 
                    0 8px 24px rgba(0, 0, 0, 0.3),
                    inset 0 1px 0 rgba(255, 255, 255, 0.2);
            }
            
            .google-btn::after {
                content: '';
                position: absolute;
                top: 50%;
                left: 50%;
                width: 0;
                height: 0;
                background: rgba(255, 255, 255, 0.1);
                border-radius: 50%;
                transform: translate(-50%, -50%);
                transition: width 0.6s, height 0.6s;
            }
            
            .google-btn:active::after {
                width: 300px;
                height: 300px;
            }
            
            .email-input {
                background: linear-gradient(145deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05));
                backdrop-filter: blur(10px);
                border: 1px solid rgba(255, 255, 255, 0.2);
                color: white !important;
                width: 100%;
                padding: 14px 16px;
                border-radius: 12px;
                font-size: 16px;
                margin: 10px 0;
                transition: all 0.3s ease;
                box-shadow: 
                    0 4px 16px rgba(0, 0, 0, 0.2),
                    inset 0 1px 0 rgba(255, 255, 255, 0.1);
            }
            
            .email-input::placeholder {
                color: rgba(255, 255, 255, 0.6) !important;
            }
            
            .email-input:focus {
                outline: none;
                border-color: rgba(255, 255, 255, 0.4);
                box-shadow: 
                    0 4px 16px rgba(0, 0, 0, 0.3),
                    inset 0 1px 0 rgba(255, 255, 255, 0.2),
                    0 0 0 2px rgba(255, 255, 255, 0.1);
            }
            
            h2, p, span, div {
                color: white !important;
            }
            
            .text-white { color: white !important; }
            .text-gray-300 { color: rgba(255, 255, 255, 0.7) !important; }
            .text-gray-500 { color: rgba(255, 255, 255, 0.5) !important; }
            .text-gray-800 { color: white !important; }
            .text-2xl { font-size: 1.5rem; }
            .text-sm { font-size: 0.875rem; }
            .font-bold { font-weight: 700; }
            .mb-2 { margin-bottom: 0.5rem; }
            .mb-4 { margin-bottom: 1rem; }
            .mb-6 { margin-bottom: 1.5rem; }
            .mt-6 { margin-top: 1.5rem; }
            .mx-auto { margin-left: auto; margin-right: auto; }
            .text-center { text-align: center; }
            .w-12 { width: 3rem; }
            .h-12 { height: 3rem; }
            .w-5 { width: 1.25rem; }
            .h-5 { height: 1.25rem; }
            .mr-2 { margin-right: 0.5rem; }
            .w-full { width: 100%; }
            .max-w-md { max-width: 28rem; }
            .rounded-2xl { border-radius: 1rem; }
            .p-8 { padding: 2rem; }
            .space-y-4 > * + * { margin-top: 1rem; }
            .flex { display: flex; }
            .items-center { align-items: center; }
            .justify-center { justify-content: center; }
            .min-h-screen { min-height: 100vh; }
            .p-4 { padding: 1rem; }
        </style>
    </head>
    <body>
        <div class="min-h-screen flex items-center justify-center p-4">
            <div class="glass-card rounded-2xl p-8 max-w-md w-full">
                <!-- Google Logo -->
                <div class="text-center mb-6">
                    <svg class="w-12 h-12 mx-auto mb-4" viewBox="0 0 24 24">
                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"></path>
                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"></path>
                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"></path>
                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"></path>
                    </svg>
                    <h2 class="text-2xl font-bold text-gray-800 mb-2">Google OAuth Mock</h2>
                    <p class="text-gray-600">Enter your Google email to continue:</p>
                </div>
                
                <div class="space-y-4">
                    <input type="email" id="email" class="email-input" placeholder="your.email@gmail.com" value="sruthi.me2005@gmail.com">
                    <button class="google-btn w-full" onclick="login()">
                        <span class="flex items-center justify-center">
                            <svg class="w-5 h-5 mr-2" viewBox="0 0 24 24">
                                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"></path>
                                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"></path>
                                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"></path>
                                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"></path>
                            </svg>
                            Continue with Google
                        </span>
                    </button>
                </div>
                
                <div class="mt-6 text-center">
                    <p class="text-sm text-gray-500">
                        This is a mock OAuth page for testing purposes
                    </p>
                </div>
            </div>
        </div>
        
        <script>
            function login() {
                const email = document.getElementById('email').value;
                if (email) {
                    // Redirect back to auth-success page with mock data
                    window.location.href = 'http://localhost:8080/auth-success.html?provider=google&email=' + encodeURIComponent(email) + '&name=' + encodeURIComponent(email.split('@')[0]);
                } else {
                    alert('Please enter an email address');
                }
            }
            
            // Allow Enter key to submit
            document.getElementById('email').addEventListener('keypress', function(e) {
                if (e.key === 'Enter') {
                    login();
                }
            });
        </script>
    </body>
    </html>
  `;
  
  res.send(mockOAuthPage);
});

app.get('/api/auth/oauth/microsoft', (req, res) => {
  // For testing, create a working mock OAuth flow
  console.log('Microsoft OAuth initiated');
  
  // Create a simple HTML page that simulates Microsoft OAuth
  const mockOAuthPage = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Microsoft OAuth Mock</title>
        <script src="https://cdn.tailwindcss.com"></script>
        <style>
            * {
                color: white !important;
            }
            
            body {
                background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
                min-height: 100vh;
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                position: relative;
                overflow: hidden;
            }
            
            body::before {
                content: '';
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: radial-gradient(circle at 20% 50%, rgba(255, 255, 255, 0.1) 0%, transparent 50%),
                            radial-gradient(circle at 80% 80%, rgba(255, 255, 255, 0.05) 0%, transparent 50%);
                pointer-events: none;
            }
            
            .glass-card {
                background: linear-gradient(145deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05));
                backdrop-filter: blur(20px);
                border: 1px solid rgba(255, 255, 255, 0.2);
                box-shadow: 
                    0 8px 32px rgba(0, 0, 0, 0.3),
                    inset 0 1px 0 rgba(255, 255, 255, 0.1);
                position: relative;
                overflow: hidden;
            }
            
            .glass-card::before {
                content: '';
                position: absolute;
                top: 0;
                left: -100%;
                width: 100%;
                height: 100%;
                background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent);
                transition: left 0.5s;
            }
            
            .glass-card:hover::before {
                left: 100%;
            }
            
            .microsoft-btn {
                background: linear-gradient(145deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05));
                backdrop-filter: blur(10px);
                border: 1px solid rgba(255, 255, 255, 0.2);
                color: white !important;
                padding: 14px 28px;
                border-radius: 12px;
                cursor: pointer;
                margin: 10px 0;
                font-size: 16px;
                font-weight: 500;
                transition: all 0.3s ease;
                box-shadow: 
                    0 4px 16px rgba(0, 0, 0, 0.2),
                    inset 0 1px 0 rgba(255, 255, 255, 0.1);
                position: relative;
                overflow: hidden;
            }
            
            .microsoft-btn:hover {
                background: linear-gradient(145deg, rgba(255, 255, 255, 0.2), rgba(255, 255, 255, 0.1));
                transform: translateY(-2px);
                box-shadow: 
                    0 8px 24px rgba(0, 0, 0, 0.3),
                    inset 0 1px 0 rgba(255, 255, 255, 0.2);
            }
            
            .microsoft-btn::after {
                content: '';
                position: absolute;
                top: 50%;
                left: 50%;
                width: 0;
                height: 0;
                background: rgba(255, 255, 255, 0.1);
                border-radius: 50%;
                transform: translate(-50%, -50%);
                transition: width 0.6s, height 0.6s;
            }
            
            .microsoft-btn:active::after {
                width: 300px;
                height: 300px;
            }
            
            .email-input {
                background: linear-gradient(145deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05));
                backdrop-filter: blur(10px);
                border: 1px solid rgba(255, 255, 255, 0.2);
                color: white !important;
                width: 100%;
                padding: 14px 16px;
                border-radius: 12px;
                font-size: 16px;
                margin: 10px 0;
                transition: all 0.3s ease;
                box-shadow: 
                    0 4px 16px rgba(0, 0, 0, 0.2),
                    inset 0 1px 0 rgba(255, 255, 255, 0.1);
            }
            
            .email-input::placeholder {
                color: rgba(255, 255, 255, 0.6) !important;
            }
            
            .email-input:focus {
                outline: none;
                border-color: rgba(255, 255, 255, 0.4);
                box-shadow: 
                    0 4px 16px rgba(0, 0, 0, 0.3),
                    inset 0 1px 0 rgba(255, 255, 255, 0.2),
                    0 0 0 2px rgba(255, 255, 255, 0.1);
            }
            
            h2, p, span, div {
                color: white !important;
            }
            
            .text-white { color: white !important; }
            .text-gray-300 { color: rgba(255, 255, 255, 0.7) !important; }
            .text-gray-500 { color: rgba(255, 255, 255, 0.5) !important; }
            .text-gray-800 { color: white !important; }
            .text-2xl { font-size: 1.5rem; }
            .text-sm { font-size: 0.875rem; }
            .font-bold { font-weight: 700; }
            .mb-2 { margin-bottom: 0.5rem; }
            .mb-4 { margin-bottom: 1rem; }
            .mb-6 { margin-bottom: 1.5rem; }
            .mt-6 { margin-top: 1.5rem; }
            .mx-auto { margin-left: auto; margin-right: auto; }
            .text-center { text-align: center; }
            .w-12 { width: 3rem; }
            .h-12 { height: 3rem; }
            .w-5 { width: 1.25rem; }
            .h-5 { height: 1.25rem; }
            .mr-2 { margin-right: 0.5rem; }
            .w-full { width: 100%; }
            .max-w-md { max-width: 28rem; }
            .rounded-2xl { border-radius: 1rem; }
            .p-8 { padding: 2rem; }
            .space-y-4 > * + * { margin-top: 1rem; }
            .flex { display: flex; }
            .items-center { align-items: center; }
            .justify-center { justify-content: center; }
            .min-h-screen { min-height: 100vh; }
            .p-4 { padding: 1rem; }
        </style>
    </head>
    <body>
        <div class="min-h-screen flex items-center justify-center p-4">
            <div class="glass-card rounded-2xl p-8 max-w-md w-full">
                <!-- Microsoft Logo -->
                <div class="text-center mb-6">
                    <svg class="w-12 h-12 mx-auto mb-4" viewBox="0 0 24 24">
                        <path fill="#F3F2F1" d="M11.4 10.8H0v2.4h11.4V24h2.4V13.2H24v-2.4H13.8V0h-2.4v10.8z"></path>
                        <path fill="#00A4EF" d="M11.4 13.2H0V24h11.4V13.2z"></path>
                        <path fill="#0078D4" d="M13.8 0v10.8H24V0h-10.2z"></path>
                        <path fill="#00BCF2" d="M13.8 13.2H24V24H13.8V13.2z"></path>
                    </svg>
                    <h2 class="text-2xl font-bold text-gray-800 mb-2">Microsoft OAuth Mock</h2>
                    <p class="text-gray-600">Enter your Microsoft email to continue:</p>
                </div>
                
                <div class="space-y-4">
                    <input type="email" id="email" class="email-input" placeholder="your.email@outlook.com" value="user@outlook.com">
                    <button class="microsoft-btn w-full" onclick="login()">
                        <span class="flex items-center justify-center">
                            <svg class="w-5 h-5 mr-2" viewBox="0 0 24 24">
                                <path fill="#F3F2F1" d="M11.4 10.8H0v2.4h11.4V24h2.4V13.2H24v-2.4H13.8V0h-2.4v10.8z"></path>
                                <path fill="#00A4EF" d="M11.4 13.2H0V24h11.4V13.2z"></path>
                                <path fill="#0078D4" d="M13.8 0v10.8H24V0h-10.2z"></path>
                                <path fill="#00BCF2" d="M13.8 13.2H24V24H13.8V13.2z"></path>
                            </svg>
                            Continue with Microsoft
                        </span>
                    </button>
                </div>
                
                <div class="mt-6 text-center">
                    <p class="text-sm text-gray-500">
                        This is a mock OAuth page for testing purposes
                    </p>
                </div>
            </div>
        </div>
        
        <script>
            function login() {
                const email = document.getElementById('email').value;
                if (email) {
                    // Redirect back to auth-success page with mock data
                    window.location.href = 'http://localhost:8080/auth-success.html?provider=microsoft&email=' + encodeURIComponent(email) + '&name=' + encodeURIComponent(email.split('@')[0]);
                } else {
                    alert('Please enter an email address');
                }
            }
            
            // Allow Enter key to submit
            document.getElementById('email').addEventListener('keypress', function(e) {
                if (e.key === 'Enter') {
                    login();
                }
            });
        </script>
    </body>
    </html>
  `;
  
  res.send(mockOAuthPage);
});

// Delete user and all their data
app.delete('/api/user/delete', (req, res) => {
  try {
    const userEmail = req.headers['x-user-email'];
    
    if (!userEmail) {
      return res.status(400).json({ error: 'User email is required' });
    }
    
    // Delete user credentials
    delete userCredentials[userEmail];
    
    // Delete user expenses
    delete userExpenses[userEmail];
    
    console.log(`User deleted: ${userEmail}`);
    
    res.json({
      success: true,
      message: 'User account and all data deleted successfully'
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all expenses for authenticated user
app.get('/api/expenses', (req, res) => {
  try {
    // Get user email from authorization header or query param
    const userEmail = req.headers['x-user-email'] || req.query.user;
    const userExpenses = getUserExpenses(userEmail);
    res.json(userExpenses);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Add new expense for authenticated user
app.post('/api/expenses', (req, res) => {
  try {
    const userEmail = req.headers['x-user-email'] || req.body.user;
    const { description, amount, category, date, paymentMethod } = req.body;
    
    // Validation
    if (!description || !amount || !category || !date) {
      return res.status(400).json({ 
        error: 'Missing required fields: description, amount, category, date' 
      });
    }

    const userExpenses = getUserExpenses(userEmail);
    const newExpense = {
      _id: nextId.toString(),
      description,
      amount: parseFloat(amount),
      category,
      date: new Date(date),
      paymentMethod: paymentMethod || 'Cash',
      createdAt: new Date(),
      updatedAt: new Date()
    };

    userExpenses.push(newExpense);
    saveUserExpenses(userEmail, userExpenses);
    nextId++;

    res.status(201).json(newExpense);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update expense for authenticated user
app.put('/api/expenses/:id', (req, res) => {
  try {
    const userEmail = req.headers['x-user-email'] || req.body.user;
    const { id } = req.params;
    const { description, amount, category, date, paymentMethod } = req.body;
    
    const userExpenses = getUserExpenses(userEmail);
    const expenseIndex = userExpenses.findIndex(exp => exp._id === id);
    
    if (expenseIndex === -1) {
      return res.status(404).json({ error: 'Expense not found' });
    }

    userExpenses[expenseIndex] = {
      ...userExpenses[expenseIndex],
      description: description || userExpenses[expenseIndex].description,
      amount: amount ? parseFloat(amount) : userExpenses[expenseIndex].amount,
      category: category || userExpenses[expenseIndex].category,
      date: date ? new Date(date) : userExpenses[expenseIndex].date,
      paymentMethod: paymentMethod || userExpenses[expenseIndex].paymentMethod,
      updatedAt: new Date()
    };

    saveUserExpenses(userEmail, userExpenses);
    res.json(userExpenses[expenseIndex]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete expense for authenticated user
app.delete('/api/expenses/:id', (req, res) => {
  try {
    const userEmail = req.headers['x-user-email'] || req.query.user;
    const { id } = req.params;
    
    const userExpenses = getUserExpenses(userEmail);
    const expenseIndex = userExpenses.findIndex(exp => exp._id === id);
    
    if (expenseIndex === -1) {
      return res.status(404).json({ error: 'Expense not found' });
    }

    userExpenses.splice(expenseIndex, 1);
    saveUserExpenses(userEmail, userExpenses);
    
    res.json({ message: 'Expense deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Analytics endpoints
app.get('/api/analytics/summary', (req, res) => {
  try {
    const userEmail = req.headers['x-user-email'] || req.query.user;
    const userExpenses = getUserExpenses(userEmail);
    
    const totalSpent = userExpenses.reduce((sum, exp) => sum + exp.amount, 0);
    const transactionCount = userExpenses.length;
    const avgTransaction = transactionCount > 0 ? totalSpent / transactionCount : 0;
    
    // Calculate daily average (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const recentExpenses = userExpenses.filter(exp => new Date(exp.date) >= thirtyDaysAgo);
    const dailyAvg = recentExpenses.length > 0 ? 
      recentExpenses.reduce((sum, exp) => sum + exp.amount, 0) / 30 : 0;

    res.json({
      totalSpent,
      transactionCount,
      avgTransaction,
      dailyAvg
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/analytics/category-breakdown', (req, res) => {
  try {
    const userEmail = req.headers['x-user-email'] || req.query.user;
    const userExpenses = getUserExpenses(userEmail);
    
    const categoryTotals = userExpenses.reduce((acc, exp) => {
      if (!acc[exp.category]) {
        acc[exp.category] = { total: 0, count: 0 };
      }
      acc[exp.category].total += exp.amount;
      acc[exp.category].count += 1;
      return acc;
    }, {});

    const breakdown = Object.entries(categoryTotals).map(([category, data]) => ({
      category,
      total: data.total,
      count: data.count,
      average: data.total / data.count
    }));

    res.json(breakdown);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/analytics/monthly-trends', (req, res) => {
  try {
    const userEmail = req.headers['x-user-email'] || req.query.user;
    const userExpenses = getUserExpenses(userEmail);
    
    const monthlyData = userExpenses.reduce((acc, exp) => {
      const month = new Date(exp.date).toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'short' 
      });
      
      if (!acc[month]) {
        acc[month] = 0;
      }
      acc[month] += exp.amount;
      return acc;
    }, {});

    const trends = Object.entries(monthlyData).map(([month, total]) => ({
      month,
      total
    })).sort((a, b) => new Date(a.month) - new Date(b.month));

    res.json(trends);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log('🚀 Mock Server running on port', PORT);
  console.log('📊 API available at http://localhost:' + PORT + '/api');
  console.log('⚠️  Running in MOCK MODE (No Database)');
});
