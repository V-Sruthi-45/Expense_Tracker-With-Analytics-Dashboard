# 👉 Expense Tracker & Spending Analytics Dashboard (MERN)

A full-stack expense tracking application with powerful analytics and spending insights built with the MERN stack (MongoDB, Express, React, Node.js).

## 🚀 Features

### Core Functionality
- **✅ Complete CRUD Operations** - Add, edit, delete, and view expenses
- **📊 Advanced Analytics Dashboard** - Visualize spending patterns with interactive charts
- **🔍 Smart Search & Filtering** - Find expenses by category, date range, or search terms
- **💳 Multiple Payment Methods** - Track expenses across different payment methods
- **📅 Monthly Budget Tracking** - Monitor spending against budget limits
- **📱 Responsive Design** - Works seamlessly on desktop, tablet, and mobile

### Analytics & Insights
- **Monthly Spending Trends** - Track spending patterns over time
- **Category-wise Breakdown** - See where your money goes
- **Day of Week Analysis** - Discover spending patterns by day
- **Payment Method Analytics** - Understand your payment preferences
- **Budget vs Actual Comparison** - Stay on track with financial goals
- **Smart Insights** - Get personalized spending recommendations

### Technical Features
- **RESTful API** - Clean and scalable backend architecture
- **MongoDB Aggregation** - Complex data processing and analytics
- **Real-time Updates** - Instant UI updates on data changes
- **Pagination & Performance** - Efficient data loading for large datasets
- **Input Validation** - Comprehensive form validation and error handling
- **Security Features** - Rate limiting, CORS, and input sanitization

## 🛠️ Tech Stack

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **JWT** - Authentication (ready for implementation)
- **Helmet** - Security middleware
- **Rate Limiting** - DDoS protection

### Frontend
- **React 18** - UI library with hooks
- **TypeScript** - Type safety
- **React Router** - Client-side routing
- **Tailwind CSS** - Utility-first styling
- **Recharts** - Data visualization
- **Heroicons** - Beautiful icons
- **Axios** - HTTP client

## 📦 Installation & Setup

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or Atlas)
- npm or yarn

### 1. Clone the Repository
```bash
git clone <repository-url>
cd expense-tracker-analytics
```

### 2. Backend Setup
```bash
# Install backend dependencies
npm install

# Create environment file
cp .env.example .env

# Edit .env with your configuration
MONGODB_URI=mongodb://localhost:27017/expense-tracker
JWT_SECRET=your-super-secret-jwt-key-here
PORT=5000
CLIENT_URL=http://localhost:8080

# Start the backend server
npm run server
```

### 3. Frontend Setup
```bash
# Start the frontend server (Python HTTP server)
python -m http.server 8080
```

### 4. Access the Application
- Frontend: http://localhost:8080
- Backend API: http://localhost:5000
- API Health Check: http://localhost:5000/api/health

## 📊 API Endpoints

### Expenses
- `GET /api/expenses` - Get all expenses with filtering and pagination
- `POST /api/expenses` - Create new expense
- `GET /api/expenses/:id` - Get single expense
- `PUT /api/expenses/:id` - Update expense
- `DELETE /api/expenses/:id` - Delete expense
- `DELETE /api/expenses` - Delete multiple expenses
- `GET /api/expenses/search/query` - Search expenses
- `GET /api/expenses/categories/list` - Get all categories

### Analytics
- `GET /api/analytics/overview` - Get spending overview
- `GET /api/analytics/monthly` - Get monthly trends
- `GET /api/analytics/categories` - Get category analytics
- `GET /api/analytics/spending-patterns` - Get spending patterns
- `GET /api/analytics/budget` - Get budget analysis

## 🎯 Usage Examples

### Adding an Expense
```javascript
const expense = {
  description: "Coffee at Starbucks",
  amount: 5.50,
  category: "Food & Dining",
  date: "2024-01-15",
  paymentMethod: "Credit Card",
  notes: "Morning coffee with colleagues"
};
```

### Filtering Expenses
```javascript
// Get expenses for January 2024
const params = {
  startDate: "2024-01-01",
  endDate: "2024-01-31",
  category: "Food & Dining",
  page: 1,
  limit: 10
};
```

### Analytics Insights
The application provides intelligent insights such as:
- "Your spending increased by 15% compared to last month"
- "Food & Dining is your highest spending category"
- "Your average transaction amount is above $50"

## 🏗️ Project Structure

```
expense-tracker-analytics/
├── server.js                 # Main server file
├── package.json             # Backend dependencies
├── .env.example             # Environment template
├── models/                  # MongoDB models
│   └── Expense.js
├── routes/                  # API routes
│   ├── expenses.js
│   └── analytics.js
└── client/                  # React frontend
    ├── public/
    ├── src/
    │   ├── components/      # Reusable components
    │   ├── contexts/        # React contexts
    │   ├── pages/           # Page components
    │   ├── types/           # TypeScript types
    │   └── utils/           # Utility functions
    ├── package.json
    └── tailwind.config.js
```

## 🔧 Development Scripts

### Backend
```bash
npm start          # Start production server
npm run server     # Start development server with nodemon
```

### Frontend
```bash
npm start          # Start development server
npm run build      # Build for production
npm test           # Run tests
```

### Full Stack Development
```bash
npm run dev         # Run both backend and frontend concurrently
```

## 📈 Sample Data & Testing

The application works best with sample data. Here are some example expenses to test the analytics:

```javascript
const sampleExpenses = [
  { description: "Grocery Shopping", amount: 120.50, category: "Food & Dining", paymentMethod: "Debit Card" },
  { description: "Netflix Subscription", amount: 15.99, category: "Entertainment", paymentMethod: "Credit Card" },
  { description: "Gas Station", amount: 45.00, category: "Transportation", paymentMethod: "Credit Card" },
  { description: "Restaurant Dinner", amount: 85.00, category: "Food & Dining", paymentMethod: "Credit Card" },
  { description: "Electric Bill", amount: 120.00, category: "Bills & Utilities", paymentMethod: "Bank Transfer" }
];
```

## 🎨 UI/UX Features

### Dashboard
- Real-time spending overview cards
- Recent transactions list
- Budget progress indicators
- Top spending categories

### Expense Management
- Intuitive expense forms with validation
- Bulk selection and deletion
- Advanced filtering options
- Responsive data tables

### Analytics Dashboard
- Interactive charts using Recharts
- Monthly trend analysis
- Category breakdown with percentages
- Spending pattern insights

## 🔒 Security Features

- Input validation and sanitization
- Rate limiting to prevent abuse
- CORS configuration
- Helmet.js security headers
- Error handling without exposing sensitive data

## 🚀 Deployment

### Backend Deployment (Heroku Example)
```bash
# Install Heroku CLI
heroku create your-app-name

# Set environment variables
heroku config:set MONGODB_URI=your-mongodb-uri
heroku config:set JWT_SECRET=your-jwt-secret

# Deploy
git push heroku main
```

### Frontend Deployment (Netlify/Vercel)
```bash
# Build the frontend
cd client
npm run build

# Deploy the build folder to your hosting provider
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 Resume Bullet Points

Here are some impressive resume points you can use:

• Built a full-stack expense tracker with MongoDB and REST APIs to store and analyze user transactions
• Implemented interactive dashboards to visualize monthly spending trends and category-wise insights using Recharts
• Developed advanced filtering and search functionality with real-time updates using React hooks and Context API
• Created data aggregation pipelines in MongoDB to generate comprehensive spending analytics and budget insights
• Designed responsive UI components with Tailwind CSS and TypeScript for optimal user experience across devices

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙋‍♂️ Support

If you have any questions or need help with the project, feel free to:
- Open an issue on GitHub
- Reach out for clarification
- Check the API documentation

---

**Built with ❤️ using the MERN stack**
