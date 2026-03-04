const express = require('express');
const router = express.Router();
const Expense = require('../models/Expense');
const validator = require('validator');

// Validation middleware
const validateExpense = (req, res, next) => {
  const { description, amount, category, date, paymentMethod } = req.body;
  
  const errors = [];
  
  if (!description || validator.isEmpty(description.trim())) {
    errors.push('Description is required');
  }
  
  if (!amount || isNaN(amount) || parseFloat(amount) <= 0) {
    errors.push('Valid amount is required');
  }
  
  if (!category || validator.isEmpty(category.trim())) {
    errors.push('Category is required');
  }
  
  if (!date || !validator.isDate(date)) {
    errors.push('Valid date is required');
  }
  
  if (!paymentMethod || validator.isEmpty(paymentMethod.trim())) {
    errors.push('Payment method is required');
  }
  
  if (errors.length > 0) {
    return res.status(400).json({ errors });
  }
  
  next();
};

// GET /api/expenses - Get all expenses with filtering and pagination
router.get('/', async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      category,
      startDate,
      endDate,
      minAmount,
      maxAmount,
      sortBy = 'date',
      sortOrder = 'desc'
    } = req.query;
    
    // Build query
    const query = {};
    
    if (category) {
      query.category = category;
    }
    
    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = new Date(startDate);
      if (endDate) query.date.$lte = new Date(endDate);
    }
    
    if (minAmount || maxAmount) {
      query.amount = {};
      if (minAmount) query.amount.$gte = parseFloat(minAmount);
      if (maxAmount) query.amount.$lte = parseFloat(maxAmount);
    }
    
    // Sort options
    const sortOptions = {};
    sortOptions[sortBy] = sortOrder === 'asc' ? 1 : -1;
    
    // Execute query with pagination
    const expenses = await Expense.find(query)
      .sort(sortOptions)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();
    
    // Get total count for pagination
    const total = await Expense.countDocuments(query);
    
    // Calculate summary statistics
    const summary = await Expense.aggregate([
      { $match: query },
      {
        $group: {
          _id: null,
          totalAmount: { $sum: '$amount' },
          averageAmount: { $avg: '$amount' },
          count: { $sum: 1 },
          minAmount: { $min: '$amount' },
          maxAmount: { $max: '$amount' }
        }
      }
    ]);
    
    res.json({
      expenses,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
        totalItems: total,
        itemsPerPage: parseInt(limit)
      },
      summary: summary[0] || {
        totalAmount: 0,
        averageAmount: 0,
        count: 0,
        minAmount: 0,
        maxAmount: 0
      }
    });
  } catch (error) {
    console.error('Error fetching expenses:', error);
    res.status(500).json({ error: 'Failed to fetch expenses' });
  }
});

// GET /api/expenses/:id - Get single expense by ID
router.get('/:id', async (req, res) => {
  try {
    const expense = await Expense.findById(req.params.id);
    
    if (!expense) {
      return res.status(404).json({ error: 'Expense not found' });
    }
    
    res.json(expense);
  } catch (error) {
    console.error('Error fetching expense:', error);
    res.status(500).json({ error: 'Failed to fetch expense' });
  }
});

// POST /api/expenses - Create new expense
router.post('/', validateExpense, async (req, res) => {
  try {
    const expenseData = {
      ...req.body,
      amount: parseFloat(req.body.amount),
      date: new Date(req.body.date)
    };
    
    const expense = new Expense(expenseData);
    const savedExpense = await expense.save();
    
    res.status(201).json({
      message: 'Expense created successfully',
      expense: savedExpense
    });
  } catch (error) {
    console.error('Error creating expense:', error);
    
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({ errors });
    }
    
    res.status(500).json({ error: 'Failed to create expense' });
  }
});

// PUT /api/expenses/:id - Update expense
router.put('/:id', validateExpense, async (req, res) => {
  try {
    const updateData = {
      ...req.body,
      amount: parseFloat(req.body.amount),
      date: new Date(req.body.date)
    };
    
    const expense = await Expense.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );
    
    if (!expense) {
      return res.status(404).json({ error: 'Expense not found' });
    }
    
    res.json({
      message: 'Expense updated successfully',
      expense
    });
  } catch (error) {
    console.error('Error updating expense:', error);
    
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({ errors });
    }
    
    res.status(500).json({ error: 'Failed to update expense' });
  }
});

// DELETE /api/expenses/:id - Delete expense
router.delete('/:id', async (req, res) => {
  try {
    const expense = await Expense.findByIdAndDelete(req.params.id);
    
    if (!expense) {
      return res.status(404).json({ error: 'Expense not found' });
    }
    
    res.json({
      message: 'Expense deleted successfully',
      expense
    });
  } catch (error) {
    console.error('Error deleting expense:', error);
    res.status(500).json({ error: 'Failed to delete expense' });
  }
});

// DELETE /api/expenses - Delete multiple expenses
router.delete('/', async (req, res) => {
  try {
    const { ids } = req.body;
    
    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ error: 'Valid expense IDs are required' });
    }
    
    const result = await Expense.deleteMany({ _id: { $in: ids } });
    
    res.json({
      message: `${result.deletedCount} expenses deleted successfully`,
      deletedCount: result.deletedCount
    });
  } catch (error) {
    console.error('Error deleting expenses:', error);
    res.status(500).json({ error: 'Failed to delete expenses' });
  }
});

// GET /api/expenses/categories - Get all unique categories
router.get('/categories/list', async (req, res) => {
  try {
    const categories = await Expense.distinct('category');
    res.json(categories.sort());
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ error: 'Failed to fetch categories' });
  }
});

// GET /api/expenses/search - Search expenses
router.get('/search/query', async (req, res) => {
  try {
    const { q, page = 1, limit = 10 } = req.query;
    
    if (!q || validator.isEmpty(q.trim())) {
      return res.status(400).json({ error: 'Search query is required' });
    }
    
    const searchRegex = new RegExp(q, 'i');
    const query = {
      $or: [
        { description: searchRegex },
        { notes: searchRegex },
        { tags: searchRegex },
        { category: searchRegex }
      ]
    };
    
    const expenses = await Expense.find(query)
      .sort({ date: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();
    
    const total = await Expense.countDocuments(query);
    
    res.json({
      expenses,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
        totalItems: total,
        itemsPerPage: parseInt(limit)
      },
      query: q
    });
  } catch (error) {
    console.error('Error searching expenses:', error);
    res.status(500).json({ error: 'Failed to search expenses' });
  }
});

module.exports = router;
