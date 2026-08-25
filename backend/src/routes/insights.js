const express = require('express');
const { requireAuth, supabase } = require('../middleware/auth');

const router = express.Router();
router.use(requireAuth);

/**
 * GET /api/insights/summary
 * Returns total spend grouped by mood and category for the user
 */
router.get('/summary', async (req, res) => {
  const user_id = req.user.id;
  
  try {
    const { data: transactions, error } = await supabase
      .from('transactions')
      .select('amount, mood_tag, category')
      .eq('user_id', user_id);
      
    if (error) throw error;
    
    const spendByMood = {};
    const spendByCategory = {};
    
    transactions.forEach(tx => {
      const amt = Number(tx.amount);
      spendByMood[tx.mood_tag] = (spendByMood[tx.mood_tag] || 0) + amt;
      spendByCategory[tx.category] = (spendByCategory[tx.category] || 0) + amt;
    });

    const moodChartData = Object.keys(spendByMood).map(mood => ({
      name: mood,
      value: spendByMood[mood]
    }));
    
    const categoryChartData = Object.keys(spendByCategory).map(cat => ({
      name: cat,
      value: spendByCategory[cat]
    }));

    res.json({
      spendByMood: moodChartData,
      spendByCategory: categoryChartData
    });
  } catch (error) {
    console.error('Insights summary error:', error);
    res.status(500).json({ error: 'Failed to generate insights' });
  }
});

module.exports = router;
