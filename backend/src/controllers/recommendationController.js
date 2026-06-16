import Groq from 'groq-sdk';
import dotenv from 'dotenv';
import Transaction from '../models/Transaction.js';

dotenv.config();

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export const getRecommendations = async (req, res) => {
  try {
    const transactions = await Transaction.find({ userId: req.user.id });

    if (transactions.length === 0) {
      return res.status(400).json({ message: 'No transactions found' });
    }

    const totalSpent = transactions.filter(t => t.type === 'debit').reduce((s, t) => s + t.amount, 0);
    const categoryTotals = {};
    transactions.filter(t => t.type === 'debit').forEach(t => {
      categoryTotals[t.category] = (categoryTotals[t.category] || 0) + t.amount;
    });

    const topTransactions = transactions
      .filter(t => t.type === 'debit')
      .sort((a, b) => b.amount - a.amount)
      .slice(0, 10)
      .map(t => `${t.title}: ₹${t.amount} (${t.category})`)
      .join('\n');

    const prompt = `You are a personal finance advisor analyzing spending data for an Indian user.

Here is their spending summary:
- Total spent: ₹${totalSpent.toLocaleString()}
- Category breakdown: ${JSON.stringify(categoryTotals, null, 2)}
- Top transactions:
${topTransactions}

Give exactly 5 specific, actionable financial recommendations based on this data.
Format your response as a JSON array of objects, each with:
- "title": short recommendation title (max 6 words)
- "description": specific actionable advice (2-3 sentences, mention actual amounts/categories from their data)
- "impact": one of "High", "Medium", "Low"
- "emoji": a relevant emoji

Return ONLY the JSON array, no other text.`;

    const completion = await groq.chat.completions.create({
      model: 'llama-3.1-8b-instant',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 1024,
      temperature: 0.7,
    });

    const raw = completion.choices[0].message.content;
    const clean = raw.replace(/```json|```/g, '').trim();
    const recommendations = JSON.parse(clean);

    res.json({ recommendations });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};