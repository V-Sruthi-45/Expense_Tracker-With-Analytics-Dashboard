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
    <html>
    <head>
        <title>Google OAuth Mock</title>
        <style>
            body { font-family: Arial, sans-serif; max-width: 400px; margin: 100px auto; padding: 20px; }
            .btn { background: #4285f4; color: white; padding: 12px 24px; border: none; border-radius: 4px; cursor: pointer; margin: 10px 0; }
            .btn:hover { background: #357ae8; }
            input { width: 100%; padding: 8px; margin: 8px 0; border: 1px solid #ddd; border-radius: 4px; }
        </style>
    </head>
    <body>
        <h2>Google OAuth Mock</h2>
        <p>Enter your Google email to continue:</p>
        <input type="email" id="email" placeholder="your.email@gmail.com" value="sruthi.me2005@gmail.com">
        <button class="btn" onclick="login()">Continue with Google</button>
        <script>
            function login() {
                const email = document.getElementById('email').value;
                if (email) {
                    window.location.href = 'http://localhost:8080/auth-success.html?provider=google&email=' + encodeURIComponent(email) + '&name=' + encodeURIComponent(email.split('@')[0]);
                }
            }
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
    <html>
    <head>
        <title>Microsoft OAuth Mock</title>
        <style>
            body { font-family: Arial, sans-serif; max-width: 400px; margin: 100px auto; padding: 20px; }
            .btn { background: #0078d4; color: white; padding: 12px 24px; border: none; border-radius: 4px; cursor: pointer; margin: 10px 0; }
            .btn:hover { background: #106ebe; }
            input { width: 100%; padding: 8px; margin: 8px 0; border: 1px solid #ddd; border-radius: 4px; }
        </style>
    </head>
    <body>
        <h2>Microsoft OAuth Mock</h2>
        <p>Enter your Microsoft email to continue:</p>
        <input type="email" id="email" placeholder="your.email@outlook.com">
        <button class="btn" onclick="login()">Continue with Microsoft</button>
        <script>
            function login() {
                const email = document.getElementById('email').value;
                if (email) {
                    window.location.href = 'http://localhost:8080/auth-success.html?provider=microsoft&email=' + encodeURIComponent(email) + '&name=' + encodeURIComponent(email.split('@')[0]);
                }
            }
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
