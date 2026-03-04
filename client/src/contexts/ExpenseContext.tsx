import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { Expense, ExpenseFormData, ExpenseResponse } from '../types';

interface ExpenseState {
  expenses: Expense[];
  loading: boolean;
  error: string | null;
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

type ExpenseAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_EXPENSES'; payload: ExpenseResponse }
  | { type: 'ADD_EXPENSE'; payload: Expense }
  | { type: 'UPDATE_EXPENSE'; payload: Expense }
  | { type: 'DELETE_EXPENSE'; payload: string }
  | { type: 'DELETE_EXPENSES'; payload: string[] };

const initialState: ExpenseState = {
  expenses: [],
  loading: false,
  error: null,
  pagination: {
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 10,
  },
  summary: {
    totalAmount: 0,
    averageAmount: 0,
    count: 0,
    minAmount: 0,
    maxAmount: 0,
  },
};

const expenseReducer = (state: ExpenseState, action: ExpenseAction): ExpenseState => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload, loading: false };
    case 'SET_EXPENSES':
      return {
        ...state,
        expenses: action.payload.expenses,
        pagination: action.payload.pagination,
        summary: action.payload.summary,
        loading: false,
        error: null,
      };
    case 'ADD_EXPENSE':
      return {
        ...state,
        expenses: [action.payload, ...state.expenses],
        summary: {
          ...state.summary,
          totalAmount: state.summary.totalAmount + action.payload.amount,
          count: state.summary.count + 1,
        },
      };
    case 'UPDATE_EXPENSE':
      return {
        ...state,
        expenses: state.expenses.map(expense =>
          expense._id === action.payload._id ? action.payload : expense
        ),
      };
    case 'DELETE_EXPENSE':
      const deletedExpense = state.expenses.find(expense => expense._id === action.payload);
      return {
        ...state,
        expenses: state.expenses.filter(expense => expense._id !== action.payload),
        summary: deletedExpense
          ? {
              ...state.summary,
              totalAmount: state.summary.totalAmount - deletedExpense.amount,
              count: state.summary.count - 1,
            }
          : state.summary,
      };
    case 'DELETE_EXPENSES':
      const deletedExpenses = state.expenses.filter(expense => action.payload.includes(expense._id));
      const totalDeletedAmount = deletedExpenses.reduce((sum, expense) => sum + expense.amount, 0);
      return {
        ...state,
        expenses: state.expenses.filter(expense => !action.payload.includes(expense._id)),
        summary: {
          ...state.summary,
          totalAmount: state.summary.totalAmount - totalDeletedAmount,
          count: state.summary.count - deletedExpenses.length,
        },
      };
    default:
      return state;
  }
};

interface ExpenseContextType {
  state: ExpenseState;
  fetchExpenses: (params?: any) => Promise<void>;
  addExpense: (expense: ExpenseFormData) => Promise<void>;
  updateExpense: (id: string, expense: ExpenseFormData) => Promise<void>;
  deleteExpense: (id: string) => Promise<void>;
  deleteExpenses: (ids: string[]) => Promise<void>;
}

const ExpenseContext = createContext<ExpenseContextType | undefined>(undefined);

export const ExpenseProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(expenseReducer, initialState);

  const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

  const fetchExpenses = async (params?: any) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const queryString = new URLSearchParams(params).toString();
      const response = await fetch(`${API_BASE_URL}/expenses${queryString ? `?${queryString}` : ''}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch expenses');
      }
      
      const data: ExpenseResponse = await response.json();
      dispatch({ type: 'SET_EXPENSES', payload: data });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error instanceof Error ? error.message : 'An error occurred' });
    }
  };

  const addExpense = async (expense: ExpenseFormData) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const response = await fetch(`${API_BASE_URL}/expenses`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(expense),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to add expense');
      }
      
      const data = await response.json();
      dispatch({ type: 'ADD_EXPENSE', payload: data.expense });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error instanceof Error ? error.message : 'An error occurred' });
      throw error;
    }
  };

  const updateExpense = async (id: string, expense: ExpenseFormData) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const response = await fetch(`${API_BASE_URL}/expenses/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(expense),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update expense');
      }
      
      const data = await response.json();
      dispatch({ type: 'UPDATE_EXPENSE', payload: data.expense });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error instanceof Error ? error.message : 'An error occurred' });
      throw error;
    }
  };

  const deleteExpense = async (id: string) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const response = await fetch(`${API_BASE_URL}/expenses/${id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to delete expense');
      }
      
      dispatch({ type: 'DELETE_EXPENSE', payload: id });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error instanceof Error ? error.message : 'An error occurred' });
      throw error;
    }
  };

  const deleteExpenses = async (ids: string[]) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const response = await fetch(`${API_BASE_URL}/expenses`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ids }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to delete expenses');
      }
      
      dispatch({ type: 'DELETE_EXPENSES', payload: ids });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error instanceof Error ? error.message : 'An error occurred' });
      throw error;
    }
  };

  return (
    <ExpenseContext.Provider
      value={{
        state,
        fetchExpenses,
        addExpense,
        updateExpense,
        deleteExpense,
        deleteExpenses,
      }}
    >
      {children}
    </ExpenseContext.Provider>
  );
};

export const useExpense = () => {
  const context = useContext(ExpenseContext);
  if (context === undefined) {
    throw new Error('useExpense must be used within an ExpenseProvider');
  }
  return context;
};
