import React, { useState, useEffect } from 'react';
import { useExpense } from '../contexts/ExpenseContext';
import { AnalyticsOverview, BudgetAnalysis } from '../types';
import { 
  CurrencyDollarIcon, 
  ShoppingCartIcon, 
  TrendingUpIcon,
  CalendarIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';

const Dashboard: React.FC = () => {
  const { state, fetchExpenses } = useExpense();
  const [analytics, setAnalytics] = useState<AnalyticsOverview | null>(null);
  const [budget, setBudget] = useState<BudgetAnalysis | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        await Promise.all([
          fetchExpenses({ limit: 5, sortBy: 'date', sortOrder: 'desc' }),
          fetchAnalytics(),
          fetchBudget()
        ]);
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/analytics/overview?period=month');
      if (response.ok) {
        const data = await response.json();
        setAnalytics(data);
      }
    } catch (error) {
      console.error('Failed to fetch analytics:', error);
    }
  };

  const fetchBudget = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/analytics/budget?monthlyBudget=3000');
      if (response.ok) {
        const data = await response.json();
        setBudget(data);
      }
    } catch (error) {
      console.error('Failed to fetch budget:', error);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const getBudgetStatus = () => {
    if (!budget) return null;
    
    switch (budget.status) {
      case 'good':
        return { icon: CheckCircleIcon, color: 'text-green-600', bgColor: 'bg-green-100' };
      case 'warning':
        return { icon: ExclamationTriangleIcon, color: 'text-yellow-600', bgColor: 'bg-yellow-100' };
      case 'over':
        return { icon: ExclamationTriangleIcon, color: 'text-red-600', bgColor: 'bg-red-100' };
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="card animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
              <div className="h-8 bg-gray-200 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-2">Overview of your expenses and spending patterns</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="card">
          <div className="flex items-center">
            <div className="bg-blue-100 rounded-lg p-3">
              <CurrencyDollarIcon className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Spent</p>
              <p className="text-2xl font-bold text-gray-900">
                {formatCurrency(analytics?.overview.totalSpent || 0)}
              </p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="bg-green-100 rounded-lg p-3">
              <ShoppingCartIcon className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Transactions</p>
              <p className="text-2xl font-bold text-gray-900">
                {analytics?.overview.transactionCount || 0}
              </p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="bg-purple-100 rounded-lg p-3">
              <TrendingUpIcon className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Average Transaction</p>
              <p className="text-2xl font-bold text-gray-900">
                {formatCurrency(analytics?.overview.averageTransaction || 0)}
              </p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            {budget && getBudgetStatus() && (
              <div className={`${getBudgetStatus()?.bgColor} rounded-lg p-3`}>
                <getBudgetStatus()!.icon className={`h-6 w-6 ${getBudgetStatus()?.color}`} />
              </div>
            )}
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Budget Used</p>
              <p className="text-2xl font-bold text-gray-900">
                {budget ? `${budget.percentageUsed.toFixed(1)}%` : '0%'}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Expenses */}
        <div className="card">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Expenses</h2>
          <div className="space-y-3">
            {state.expenses.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No expenses yet</p>
            ) : (
              state.expenses.map((expense) => (
                <div key={expense._id} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{expense.description}</p>
                    <p className="text-sm text-gray-500">{expense.category}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">{formatCurrency(expense.amount)}</p>
                    <p className="text-sm text-gray-500">{formatDate(expense.date)}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Budget Overview */}
        {budget && (
          <div className="card">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Budget Overview</h2>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-600">Monthly Budget</span>
                  <span className="text-sm font-bold text-gray-900">{formatCurrency(budget.budget)}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div 
                    className={`h-3 rounded-full ${
                      budget.status === 'good' ? 'bg-green-500' : 
                      budget.status === 'warning' ? 'bg-yellow-500' : 'bg-red-500'
                    }`}
                    style={{ width: `${Math.min(budget.percentageUsed, 100)}%` }}
                  ></div>
                </div>
                <div className="flex justify-between items-center mt-2">
                  <span className="text-xs text-gray-500">{formatCurrency(budget.spent)} spent</span>
                  <span className="text-xs text-gray-500">{formatCurrency(budget.remaining)} left</span>
                </div>
              </div>

              <div className="pt-4 border-t border-gray-200">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Projected Monthly</p>
                    <p className="text-lg font-bold text-gray-900">{formatCurrency(budget.projectedMonthly)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Days Remaining</p>
                    <p className="text-lg font-bold text-gray-900">{budget.daysRemaining}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Top Categories */}
      {analytics?.categoryBreakdown && analytics.categoryBreakdown.length > 0 && (
        <div className="card">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Top Spending Categories</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {analytics.categoryBreakdown.slice(0, 6).map((category, index) => (
              <div key={category._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center">
                  <div className={`w-3 h-3 rounded-full mr-3 ${
                    index === 0 ? 'bg-blue-500' :
                    index === 1 ? 'bg-green-500' :
                    index === 2 ? 'bg-yellow-500' :
                    index === 3 ? 'bg-purple-500' :
                    index === 4 ? 'bg-pink-500' : 'bg-gray-500'
                  }`}></div>
                  <div>
                    <p className="font-medium text-gray-900">{category._id}</p>
                    <p className="text-sm text-gray-500">{category.count} transactions</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-gray-900">{formatCurrency(category.total)}</p>
                  <p className="text-sm text-gray-500">{formatCurrency(category.average)} avg</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
