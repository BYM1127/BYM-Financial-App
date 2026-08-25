const express = require('express');
const { supabase } = require('../middleware/auth');

const router = express.Router();
const GUEST_ID = '00000000-0000-0000-0000-000000000000';

/**
 * GET /api/insights/summary
 * Returns total spend grouped by mood and category for the user
 */
router.get('/summary', async (req, res) => {
  const user_id = GUEST_ID;
  
  try {
    const { data: transactions, error } = await supabase
      .from('transactions')
      .select('*')
      .eq('user_id', user_id);

    if (error) throw error;

    let total_income = 0;
    let total_expenses = 0;
    let categoryBreakdown = {};
    let moodBreakdown = {};

    transactions.forEach(tx => {
      const amount = parseFloat(tx.amount);
      
      if (tx.type === 'income') {
        total_income += amount;
      } else {
        total_expenses += amount;

        // Only breakdown expenses
        if (categoryBreakdown[tx.category]) {
          categoryBreakdown[tx.category] += amount;
        } else {
          categoryBreakdown[tx.category] = amount;
        }

        if (moodBreakdown[tx.mood_tag]) {
          moodBreakdown[tx.mood_tag] += amount;
        } else {
          moodBreakdown[tx.mood_tag] = amount;
        }
      }
    });

    const in_my_pocket = total_income - total_expenses;

    const spendByMood = Object.keys(moodBreakdown).map(mood => ({
      name: mood,
      value: moodBreakdown[mood]
    }));
    
    const spendByCategory = Object.keys(categoryBreakdown).map(cat => ({
      name: cat,
      value: categoryBreakdown[cat]
    }));

    res.json({
      total_income,
      total_expenses,
      in_my_pocket,
      spendByMood,
      spendByCategory,
      totalTransactions: transactions.length
    });
  } catch (error) {
    console.error('Insights summary error:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
