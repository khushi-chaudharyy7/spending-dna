import Transaction from '../models/Transaction.js';
import csv from 'csv-parser';
import fs from 'fs';

const ML_SERVICE_URL = process.env.ML_SERVICE_URL || 'http://localhost:5001';

// helper to auto-categorize via ML service
const getCategory = async (title) => {
  try {
    const res = await fetch(`${ML_SERVICE_URL}/categorize`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title })
    });
    const data = await res.json();
    return data.category || 'Other';
  } catch {
    return 'Other';
  }
};

export const addTransaction = async (req, res) => {
  try {
    const { title, amount, date, type, notes } = req.body;

    // auto-categorize if category not provided
    const category = req.body.category || await getCategory(title);

    const transaction = await Transaction.create({
      userId: req.user.id,
      title, amount, category, date, type, notes
    });
    res.status(201).json(transaction);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.find({ userId: req.user.id }).sort({ date: -1 });
    res.json(transactions);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const deleteTransaction = async (req, res) => {
  try {
    const transaction = await Transaction.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.id
    });
    if (!transaction) return res.status(404).json({ message: 'Transaction not found' });
    res.json({ message: 'Transaction deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const uploadCSV = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'No file uploaded' });

    const rows = [];

    fs.createReadStream(req.file.path)
      .pipe(csv())
      .on('data', (row) => rows.push(row))
      .on('end', async () => {
        const transactions = await Promise.all(rows.map(async (row) => {
          const title = row.title || row.Title || row.description || row.Description || '';
          const category = row.category || row.Category || await getCategory(title);
          return {
            userId: req.user.id,
            title,
            amount: parseFloat(row.amount || row.Amount),
            category,
            date: new Date(row.date || row.Date),
            type: row.type || row.Type || 'debit',
            notes: row.notes || row.Notes || '',
          };
        }));

        await Transaction.insertMany(transactions);
        fs.unlinkSync(req.file.path);
        res.status(201).json({ message: `${transactions.length} transactions imported` });
      });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const analyzeSpending = async (req, res) => {
  try {
    const transactions = await Transaction.find({ userId: req.user.id });

    if (transactions.length === 0) {
      return res.status(400).json({ message: 'No transactions found' });
    }

    const res2 = await fetch(`${ML_SERVICE_URL}/analyze`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ transactions })
    });

    const analysis = await res2.json();
    res.json(analysis);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};