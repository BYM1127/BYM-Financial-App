const express = require('express');
const { requireAuth, supabase } = require('../middleware/auth');
const { parseTransaction } = require('../services/gemini');

const router = express.Router();

// Apply auth middleware to all transaction routes
// router.use(requireAuth); 
// Note: For local testing without a frontend token, you can comment this out and use a mock user_id.
// Assuming we are building the real thing, we will keep requireAuth.
router.use(requireAuth);

/**
 * POST /api/transactions/parse
 * Parse raw text into structured JSON via Gemini
 */
router.post('/parse', async (req, res) => {
  const { raw_text } = req.body;
  if (!raw_text) {
    return res.status(400).json({ error: 'raw_text is required' });
  }

  try {
    const parsedData = await parseTransaction(raw_text);
    res.json(parsedData);
  } catch (error) {
    console.error('Parse route error:', error);
    res.status(500).json({ error: 'Failed to parse transaction text' });
  }
});

/**
 * POST /api/transactions
 * Save a confirmed transaction to the database
 */
router.post('/', async (req, res) => {
  const user_id = req.user.id;
  const { raw_input, amount, currency, category, merchant, mood_tag } = req.body;

  if (amount == null || !category || !mood_tag) {
    return res.status(400).json({ error: 'amount, category, and mood_tag are required' });
  }

  try {
    const { data, error } = await supabase
      .from('transactions')
      .insert([{
        user_id,
        raw_input: raw_input || '',
        amount,
        currency,
        category,
        merchant,
        mood_tag
      }])
      .select()
      .single();

    if (error) throw error;
    res.status(201).json(data);
  } catch (error) {
    console.error('Create transaction error:', error);
    res.status(500).json({ error: 'Failed to save transaction' });
  }
});

/**
 * GET /api/transactions
 * Fetch user transactions
 */
router.get('/', async (req, res) => {
  const user_id = req.user.id;
  const { startDate, endDate } = req.query;

  try {
    let query = supabase
      .from('transactions')
      .select('*')
      .eq('user_id', user_id)
      .order('transaction_date', { ascending: false });

    if (startDate) {
      query = query.gte('transaction_date', startDate);
    }
    if (endDate) {
      query = query.lte('transaction_date', endDate);
    }

    const { data, error } = await query;
    if (error) throw error;
    
    res.json(data);
  } catch (error) {
    console.error('Fetch transactions error:', error);
    res.status(500).json({ error: 'Failed to fetch transactions' });
  }
});

/**
 * PATCH /api/transactions/:id
 * Update an existing transaction
 */
router.patch('/:id', async (req, res) => {
  const user_id = req.user.id;
  const { id } = req.params;
  const updates = req.body;

  try {
    const { data, error } = await supabase
      .from('transactions')
      .update(updates)
      .eq('id', id)
      .eq('user_id', user_id) // ensure user owns it
      .select()
      .single();

    if (error) throw error;
    res.json(data);
  } catch (error) {
    console.error('Update transaction error:', error);
    res.status(500).json({ error: 'Failed to update transaction' });
  }
});

/**
 * DELETE /api/transactions/:id
 * Delete a transaction
 */
router.delete('/:id', async (req, res) => {
  const user_id = req.user.id;
  const { id } = req.params;

  try {
    const { error } = await supabase
      .from('transactions')
      .delete()
      .eq('id', id)
      .eq('user_id', user_id);

    if (error) throw error;
    res.json({ success: true });
  } catch (error) {
    console.error('Delete transaction error:', error);
    res.status(500).json({ error: 'Failed to delete transaction' });
  }
});

module.exports = router;
