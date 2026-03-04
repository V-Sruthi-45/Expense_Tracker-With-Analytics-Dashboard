export interface Expense {
  _id: string;
  description: string;
  amount: number;
  category: string;
  date: string;
  paymentMethod: string;
  tags?: string[];
  notes?: string;
  isRecurring?: boolean;
  recurringFrequency?: string;
  createdAt: string;
  updatedAt: string;
  formattedAmount?: string;
  monthYear?: string;
}

export interface ExpenseFormData {
  description: string;
  amount: string;
  category: string;
  date: string;
  paymentMethod: string;
  tags?: string[];
  notes?: string;
  isRecurring?: boolean;
  recurringFrequency?: string;
}

export interface ExpenseResponse {
  expenses: Expense[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
  };
  summary: {
    totalAmount: number;
    averageAmount: number;
    count: number;
    minAmount: number;
    maxAmount: number;
  };
}

export interface AnalyticsOverview {
  period: string;
  overview: {
    totalSpent: number;
    transactionCount: number;
    averageTransaction: number;
    highestTransaction: number;
    lowestTransaction: number;
  };
  categoryBreakdown: Array<{
    _id: string;
    total: number;
    count: number;
    average: number;
  }>;
  dailySpending: Array<{
    _id: {
      year: number;
      month: number;
      day: number;
    };
    total: number;
    count: number;
  }>;
}

export interface MonthlyTrend {
  month: string;
  total: number;
  count: number;
  average: number;
  year: number;
  monthNum: number;
  growth: number;
}

export interface CategoryAnalytics {
  period: string;
  categories: Array<{
    _id: string;
    total: number;
    count: number;
    average: number;
    min: number;
    max: number;
    percentage: number;
  }>;
  totalSpent: number;
  monthlyTrends: Array<{
    category: string;
    trend: Array<{
      _id: {
        year: number;
        month: number;
      };
      total: number;
      count: number;
    }>;
  }>;
}

export interface SpendingPattern {
  comparison: {
    lastMonth: {
      total: number;
      count: number;
    };
    thisMonth: {
      total: number;
      count: number;
    };
  };
  dayOfWeekAnalysis: Array<{
    _id: number;
    total: number;
    count: number;
    average: number;
  }>;
  paymentMethodAnalysis: Array<{
    _id: string;
    total: number;
    count: number;
    average: number;
  }>;
  topCategories: Array<{
    _id: string;
    total: number;
    count: number;
  }>;
  insights: string[];
}

export interface BudgetAnalysis {
  budget: number;
  spent: number;
  remaining: number;
  percentageUsed: number;
  projectedMonthly: number;
  status: 'good' | 'warning' | 'over';
  categoryBreakdown: Array<{
    _id: string;
    total: number;
    count: number;
  }>;
  daysRemaining: number;
}
