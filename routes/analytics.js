const express = require('express');
const router = express.Router();
const Expense = require('../models/Expense');

// GET /api/analytics/overview - Get overall spending overview
router.get('/overview', async (req, res) => {
  try {
    const { period = 'month' } = req.query;
    
    let startDate;
    const now = new Date();
    
    switch (period) {
      case 'week':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case 'month':
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        break;
      case 'year':
        startDate = new Date(now.getFullYear(), 0, 1);
        break;
      default:
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
    }
    
    const overview = await Expense.aggregate([
      {
        $match: {
          date: { $gte: startDate }
        }
      },
      {
        $group: {
          _id: null,
          totalSpent: { $sum: '$amount' },
          transactionCount: { $sum: 1 },
          averageTransaction: { $avg: '$amount' },
          highestTransaction: { $max: '$amount' },
          lowestTransaction: { $min: '$amount' }
        }
      }
    ]);
    
    const categoryBreakdown = await Expense.aggregate([
      {
        $match: {
          date: { $gte: startDate }
        }
      },
      {
        $group: {
          _id: '$category',
          total: { $sum: '$amount' },
          count: { $sum: 1 },
          average: { $avg: '$amount' }
        }
      },
      {
        $sort: { total: -1 }
      }
    ]);
    
    const dailySpending = await Expense.aggregate([
      {
        $match: {
          date: { $gte: startDate }
        }
      },
      {
        $group: {
          _id: {
            year: { $year: '$date' },
            month: { $month: '$date' },
            day: { $dayOfMonth: '$date' }
          },
          total: { $sum: '$amount' },
          count: { $sum: 1 }
        }
      },
      {
        $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1 }
      }
    ]);
    
    res.json({
      period,
      overview: overview[0] || {
        totalSpent: 0,
        transactionCount: 0,
        averageTransaction: 0,
        highestTransaction: 0,
        lowestTransaction: 0
      },
      categoryBreakdown,
      dailySpending
    });
  } catch (error) {
    console.error('Error fetching overview:', error);
    res.status(500).json({ error: 'Failed to fetch analytics overview' });
  }
});

// GET /api/analytics/monthly - Get monthly spending trends
router.get('/monthly', async (req, res) => {
  try {
    const { months = 12 } = req.query;
    
    const startDate = new Date();
    startDate.setMonth(startDate.getMonth() - parseInt(months));
    
    const monthlyTrends = await Expense.aggregate([
      {
        $match: {
          date: { $gte: startDate }
        }
      },
      {
        $group: {
          _id: {
            year: { $year: '$date' },
            month: { $month: '$date' }
          },
          total: { $sum: '$amount' },
          count: { $sum: 1 },
          average: { $avg: '$amount' },
          categories: {
            $push: '$category'
          }
        }
      },
      {
        $sort: { '_id.year': 1, '_id.month': 1 }
      },
      {
        $project: {
          month: {
            $concat: [
              { $toString: '$_id.year' },
              '-',
              {
                $cond: {
                  if: { $lt: ['$_id.month', 10] },
                  then: { $concat: ['0', { $toString: '$_id.month' }] },
                  else: { $toString: '$_id.month' }
                }
              }
            ]
          },
          total: 1,
          count: 1,
          average: 1,
          year: '$_id.year',
          monthNum: '$_id.month'
        }
      }
    ]);
    
    // Calculate month-over-month growth
    const trendsWithGrowth = monthlyTrends.map((trend, index) => {
      const growth = index > 0 
        ? ((trend.total - monthlyTrends[index - 1].total) / monthlyTrends[index - 1].total) * 100
        : 0;
      
      return {
        ...trend,
        growth: Math.round(growth * 100) / 100
      };
    });
    
    res.json({
      trends: trendsWithGrowth,
      period: `${months} months`
    });
  } catch (error) {
    console.error('Error fetching monthly trends:', error);
    res.status(500).json({ error: 'Failed to fetch monthly trends' });
  }
});

// GET /api/analytics/categories - Get category-wise analytics
router.get('/categories', async (req, res) => {
  try {
    const { period = 'month' } = req.query;
    
    let startDate;
    const now = new Date();
    
    switch (period) {
      case 'week':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case 'month':
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        break;
      case 'year':
        startDate = new Date(now.getFullYear(), 0, 1);
        break;
      default:
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
    }
    
    const categoryAnalytics = await Expense.aggregate([
      {
        $match: {
          date: { $gte: startDate }
        }
      },
      {
        $group: {
          _id: '$category',
          total: { $sum: '$amount' },
          count: { $sum: 1 },
          average: { $avg: '$amount' },
          min: { $min: '$amount' },
          max: { $max: '$amount' }
        }
      },
      {
        $sort: { total: -1 }
      }
    ]);
    
    // Calculate percentages
    const totalSpent = categoryAnalytics.reduce((sum, cat) => sum + cat.total, 0);
    const categoryWithPercentage = categoryAnalytics.map(cat => ({
      ...cat,
      percentage: totalSpent > 0 ? Math.round((cat.total / totalSpent) * 100 * 100) / 100 : 0
    }));
    
    // Get monthly trend for top categories
    const topCategories = categoryWithPercentage.slice(0, 5);
    const monthlyCategoryTrends = await Promise.all(
      topCategories.map(async (category) => {
        const trend = await Expense.aggregate([
          {
            $match: {
              category: category._id,
              date: { $gte: new Date(now.getFullYear(), now.getMonth() - 5, 1) }
            }
          },
          {
            $group: {
              _id: {
                year: { $year: '$date' },
                month: { $month: '$date' }
              },
              total: { $sum: '$amount' },
              count: { $sum: 1 }
            }
          },
          {
            $sort: { '_id.year': 1, '_id.month': 1 }
          }
        ]);
        
        return {
          category: category._id,
          trend
        };
      })
    );
    
    res.json({
      period,
      categories: categoryWithPercentage,
      totalSpent,
      monthlyTrends: monthlyCategoryTrends
    });
  } catch (error) {
    console.error('Error fetching category analytics:', error);
    res.status(500).json({ error: 'Failed to fetch category analytics' });
  }
});

// GET /api/analytics/spending-patterns - Get spending patterns and insights
router.get('/spending-patterns', async (req, res) => {
  try {
    const now = new Date();
    const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    
    // Compare current month vs last month
    const [lastMonthSpending, thisMonthSpending] = await Promise.all([
      Expense.aggregate([
        { $match: { date: { $gte: lastMonth, $lt: thisMonth } } },
        { $group: { _id: null, total: { $sum: '$amount' }, count: { $sum: 1 } } }
      ]),
      Expense.aggregate([
        { $match: { date: { $gte: thisMonth } } },
        { $group: { _id: null, total: { $sum: '$amount' }, count: { $sum: 1 } } }
      ])
    ]);
    
    // Day of week analysis
    const dayOfWeekAnalysis = await Expense.aggregate([
      {
        $match: {
          date: { $gte: new Date(now.getFullYear(), 0, 1) }
        }
      },
      {
        $group: {
          _id: { $dayOfWeek: '$date' },
          total: { $sum: '$amount' },
          count: { $sum: 1 },
          average: { $avg: '$amount' }
        }
      },
      {
        $sort: { '_id': 1 }
      }
    ]);
    
    // Payment method analysis
    const paymentMethodAnalysis = await Expense.aggregate([
      {
        $match: {
          date: { $gte: new Date(now.getFullYear(), 0, 1) }
        }
      },
      {
        $group: {
          _id: '$paymentMethod',
          total: { $sum: '$amount' },
          count: { $sum: 1 },
          average: { $avg: '$amount' }
        }
      },
      {
        $sort: { total: -1 }
      }
    ]);
    
    // Top spending categories
    const topCategories = await Expense.aggregate([
      {
        $match: {
          date: { $gte: new Date(now.getFullYear(), 0, 1) }
        }
      },
      {
        $group: {
          _id: '$category',
          total: { $sum: '$amount' },
          count: { $sum: 1 }
        }
      },
      {
        $sort: { total: -1 }
      },
      {
        $limit: 10
      }
    ]);
    
    // Insights
    const insights = [];
    
    const lastMonthTotal = lastMonthSpending[0]?.total || 0;
    const thisMonthTotal = thisMonthSpending[0]?.total || 0;
    
    if (thisMonthTotal > lastMonthTotal) {
      const increase = ((thisMonthTotal - lastMonthTotal) / lastMonthTotal) * 100;
      insights.push(`Spending increased by ${increase.toFixed(1)}% compared to last month`);
    } else if (thisMonthTotal < lastMonthTotal) {
      const decrease = ((lastMonthTotal - thisMonthTotal) / lastMonthTotal) * 100;
      insights.push(`Spending decreased by ${decrease.toFixed(1)}% compared to last month`);
    }
    
    if (topCategories.length > 0) {
      insights.push(`${topCategories[0]._id} is your highest spending category`);
    }
    
    const avgTransaction = thisMonthSpending[0]?.total / thisMonthSpending[0]?.count || 0;
    if (avgTransaction > 100) {
      insights.push('Your average transaction amount is above $100');
    }
    
    res.json({
      comparison: {
        lastMonth: lastMonthSpending[0] || { total: 0, count: 0 },
        thisMonth: thisMonthSpending[0] || { total: 0, count: 0 }
      },
      dayOfWeekAnalysis,
      paymentMethodAnalysis,
      topCategories,
      insights
    });
  } catch (error) {
    console.error('Error fetching spending patterns:', error);
    res.status(500).json({ error: 'Failed to fetch spending patterns' });
  }
});

// GET /api/analytics/budget - Get budget analysis
router.get('/budget', async (req, res) => {
  try {
    const { monthlyBudget = 3000 } = req.query;
    const budget = parseFloat(monthlyBudget);
    
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    
    const currentMonthSpending = await Expense.aggregate([
      {
        $match: {
          date: { $gte: startOfMonth }
        }
      },
      {
        $group: {
          _id: null,
          total: { $sum: '$amount' },
          count: { $sum: 1 }
        }
      }
    ]);
    
    const spent = currentMonthSpending[0]?.total || 0;
    const remaining = budget - spent;
    const percentageUsed = (spent / budget) * 100;
    
    // Project monthly spending based on current rate
    const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
    const daysPassed = now.getDate();
    const projectedMonthly = (spent / daysPassed) * daysInMonth;
    
    // Category budget breakdown (equal distribution for demo)
    const categorySpending = await Expense.aggregate([
      {
        $match: {
          date: { $gte: startOfMonth }
        }
      },
      {
        $group: {
          _id: '$category',
          total: { $sum: '$amount' },
          count: { $sum: 1 }
        }
      },
      {
        $sort: { total: -1 }
      }
    ]);
    
    res.json({
      budget,
      spent,
      remaining,
      percentageUsed: Math.round(percentageUsed * 100) / 100,
      projectedMonthly: Math.round(projectedMonthly * 100) / 100,
      status: percentageUsed > 100 ? 'over' : percentageUsed > 80 ? 'warning' : 'good',
      categoryBreakdown: categorySpending,
      daysRemaining: daysInMonth - daysPassed
    });
  } catch (error) {
    console.error('Error fetching budget analysis:', error);
    res.status(500).json({ error: 'Failed to fetch budget analysis' });
  }
});

module.exports = router;
