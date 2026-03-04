// Mock data for development without MongoDB
const mockExpenses = [
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
    },
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
    },
    {
        _id: "5",
        description: "Movie Tickets",
        amount: 350,
        category: "Entertainment",
        date: new Date("2024-01-19"),
        paymentMethod: "Cash",
        createdAt: new Date("2024-01-19"),
        updatedAt: new Date("2024-01-19")
    }
];

module.exports = { mockExpenses };
