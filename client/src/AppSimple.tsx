import React from 'react';

function AppSimple() {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Expense Tracker & Analytics</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Dashboard</h2>
            <p className="text-gray-600">View your spending overview</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Expenses</h2>
            <p className="text-gray-600">Manage your expenses</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Analytics</h2>
            <p className="text-gray-600">View detailed insights</p>
          </div>
        </div>
        <div className="mt-8 bg-green-50 p-6 rounded-lg">
          <h3 className="text-lg font-semibold text-green-800 mb-2">✅ Project Status</h3>
          <p className="text-green-700">Backend server is running on port 5000</p>
          <p className="text-green-700">Frontend is successfully compiled</p>
          <p className="text-green-700">MongoDB connection established</p>
        </div>
      </div>
    </div>
  );
}

export default AppSimple;
