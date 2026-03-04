import React, { useState, useEffect } from 'react';
import { useExpense } from '../contexts/ExpenseContext';
import { Expense, ExpenseFormData } from '../types';
import { 
  PlusIcon, 
  PencilIcon, 
  TrashIcon, 
  MagnifyingGlassIcon,
  FunnelIcon
} from '@heroicons/react/24/outline';

const Expenses: React.FC = () => {
  const { state, fetchExpenses, addExpense, updateExpense, deleteExpense } = useExpense();
  const [showForm, setShowForm] = useState(false);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [filterDateRange, setFilterDateRange] = useState({ start: '', end: '' });
  const [selectedExpenses, setSelectedExpenses] = useState<string[]>([]);

  const [formData, setFormData] = useState<ExpenseFormData>({
    description: '',
    amount: '',
    category: 'Food & Dining',
    date: new Date().toISOString().split('T')[0],
    paymentMethod: 'Credit Card',
    tags: [],
    notes: '',
    isRecurring: false,
    recurringFrequency: 'Monthly'
  });

  const categories = [
    'Food & Dining',
    'Transportation',
    'Shopping',
    'Entertainment',
    'Bills & Utilities',
    'Healthcare',
    'Education',
    'Travel',
    'Investment',
    'Personal Care',
    'Gifts & Donations',
    'Other'
  ];

  const paymentMethods = [
    'Cash',
    'Credit Card',
    'Debit Card',
    'Bank Transfer',
    'Digital Wallet',
    'Other'
  ];

  useEffect(() => {
    const params = new URLSearchParams();
    if (searchTerm) params.append('q', searchTerm);
    if (filterCategory) params.append('category', filterCategory);
    if (filterDateRange.start) params.append('startDate', filterDateRange.start);
    if (filterDateRange.end) params.append('endDate', filterDateRange.end);
    
    fetchExpenses(Object.fromEntries(params));
  }, [searchTerm, filterCategory, filterDateRange]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingExpense) {
        await updateExpense(editingExpense._id, formData);
      } else {
        await addExpense(formData);
      }
      resetForm();
    } catch (error) {
      console.error('Failed to save expense:', error);
    }
  };

  const resetForm = () => {
    setFormData({
      description: '',
      amount: '',
      category: 'Food & Dining',
      date: new Date().toISOString().split('T')[0],
      paymentMethod: 'Credit Card',
      tags: [],
      notes: '',
      isRecurring: false,
      recurringFrequency: 'Monthly'
    });
    setShowForm(false);
    setEditingExpense(null);
  };

  const handleEdit = (expense: Expense) => {
    setEditingExpense(expense);
    setFormData({
      description: expense.description,
      amount: expense.amount.toString(),
      category: expense.category,
      date: expense.date.split('T')[0],
      paymentMethod: expense.paymentMethod,
      tags: expense.tags || [],
      notes: expense.notes || '',
      isRecurring: expense.isRecurring || false,
      recurringFrequency: expense.recurringFrequency || 'Monthly'
    });
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this expense?')) {
      try {
        await deleteExpense(id);
      } catch (error) {
        console.error('Failed to delete expense:', error);
      }
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

  const toggleExpenseSelection = (id: string) => {
    setSelectedExpenses(prev =>
      prev.includes(id)
        ? prev.filter(expId => expId !== id)
        : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedExpenses.length === state.expenses.length) {
      setSelectedExpenses([]);
    } else {
      setSelectedExpenses(state.expenses.map(expense => expense._id));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Expenses</h1>
          <p className="text-gray-600 mt-2">Manage and track your expenses</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="btn-primary flex items-center space-x-2"
        >
          <PlusIcon className="h-5 w-5" />
          <span>Add Expense</span>
        </button>
      </div>

      {/* Filters and Search */}
      <div className="card">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search expenses..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input pl-10"
            />
          </div>
          
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="input"
          >
            <option value="">All Categories</option>
            {categories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
          
          <input
            type="date"
            value={filterDateRange.start}
            onChange={(e) => setFilterDateRange(prev => ({ ...prev, start: e.target.value }))}
            className="input"
            placeholder="Start date"
          />
          
          <input
            type="date"
            value={filterDateRange.end}
            onChange={(e) => setFilterDateRange(prev => ({ ...prev, end: e.target.value }))}
            className="input"
            placeholder="End date"
          />
        </div>
      </div>

      {/* Expense Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              {editingExpense ? 'Edit Expense' : 'Add New Expense'}
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="label">Description</label>
                <input
                  type="text"
                  required
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  className="input"
                />
              </div>
              
              <div>
                <label className="label">Amount</label>
                <input
                  type="number"
                  step="0.01"
                  required
                  value={formData.amount}
                  onChange={(e) => setFormData(prev => ({ ...prev, amount: e.target.value }))}
                  className="input"
                />
              </div>
              
              <div>
                <label className="label">Category</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                  className="input"
                >
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="label">Date</label>
                <input
                  type="date"
                  required
                  value={formData.date}
                  onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                  className="input"
                />
              </div>
              
              <div>
                <label className="label">Payment Method</label>
                <select
                  value={formData.paymentMethod}
                  onChange={(e) => setFormData(prev => ({ ...prev, paymentMethod: e.target.value }))}
                  className="input"
                >
                  {paymentMethods.map(method => (
                    <option key={method} value={method}>{method}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="label">Notes</label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                  className="input"
                  rows={3}
                />
              </div>
              
              <div className="flex space-x-3">
                <button type="submit" className="btn-primary flex-1">
                  {editingExpense ? 'Update' : 'Add'} Expense
                </button>
                <button type="button" onClick={resetForm} className="btn-secondary flex-1">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Expenses List */}
      <div className="card">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-gray-900">
            Expenses ({state.pagination.totalItems})
          </h2>
          {selectedExpenses.length > 0 && (
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">
                {selectedExpenses.length} selected
              </span>
              <button className="btn-danger text-sm">
                Delete Selected
              </button>
            </div>
          )}
        </div>

        {state.loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="text-gray-600 mt-2">Loading expenses...</p>
          </div>
        ) : state.expenses.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500">No expenses found</p>
            <button
              onClick={() => setShowForm(true)}
              className="btn-primary mt-4"
            >
              Add Your First Expense
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4">
                    <input
                      type="checkbox"
                      checked={selectedExpenses.length === state.expenses.length}
                      onChange={handleSelectAll}
                      className="rounded"
                    />
                  </th>
                  <th className="text-left py-3 px-4">Description</th>
                  <th className="text-left py-3 px-4">Category</th>
                  <th className="text-left py-3 px-4">Amount</th>
                  <th className="text-left py-3 px-4">Date</th>
                  <th className="text-left py-3 px-4">Payment Method</th>
                  <th className="text-left py-3 px-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {state.expenses.map((expense) => (
                  <tr key={expense._id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4">
                      <input
                        type="checkbox"
                        checked={selectedExpenses.includes(expense._id)}
                        onChange={() => toggleExpenseSelection(expense._id)}
                        className="rounded"
                      />
                    </td>
                    <td className="py-3 px-4">
                      <div>
                        <p className="font-medium text-gray-900">{expense.description}</p>
                        {expense.notes && (
                          <p className="text-sm text-gray-500">{expense.notes}</p>
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {expense.category}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-semibold text-gray-900">
                      {formatCurrency(expense.amount)}
                    </td>
                    <td className="py-3 px-4 text-gray-600">
                      {formatDate(expense.date)}
                    </td>
                    <td className="py-3 px-4 text-gray-600">
                      {expense.paymentMethod}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEdit(expense)}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          <PencilIcon className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(expense._id)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <TrashIcon className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {state.pagination.totalPages > 1 && (
          <div className="flex justify-between items-center mt-6">
            <div className="text-sm text-gray-600">
              Showing {((state.pagination.currentPage - 1) * state.pagination.itemsPerPage) + 1} to{' '}
              {Math.min(state.pagination.currentPage * state.pagination.itemsPerPage, state.pagination.totalItems)} of{' '}
              {state.pagination.totalItems} expenses
            </div>
            <div className="flex space-x-2">
              <button
                disabled={state.pagination.currentPage === 1}
                onClick={() => fetchExpenses({ page: state.pagination.currentPage - 1 })}
                className="btn-secondary disabled:opacity-50"
              >
                Previous
              </button>
              <button
                disabled={state.pagination.currentPage === state.pagination.totalPages}
                onClick={() => fetchExpenses({ page: state.pagination.currentPage + 1 })}
                className="btn-secondary disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Expenses;
