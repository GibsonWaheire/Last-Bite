import express from 'express';

const router = express.Router();

// GET /api/stores - Get all stores
router.get('/', (req, res) => {
  res.json({ 
    message: 'Stores endpoint',
    data: [] // Will be replaced with actual data
  });
});

// GET /api/stores/:id - Get specific store
router.get('/:id', (req, res) => {
  const { id } = req.params;
  res.json({ 
    message: `Store ${id}`,
    data: null // Will be replaced with actual data
  });
});

// POST /api/stores - Create new store
router.post('/', (req, res) => {
  res.json({ 
    message: 'Store created',
    data: req.body
  });
});

// PUT /api/stores/:id - Update store
router.put('/:id', (req, res) => {
  const { id } = req.params;
  res.json({ 
    message: `Store ${id} updated`,
    data: req.body
  });
});

// DELETE /api/stores/:id - Delete store
router.delete('/:id', (req, res) => {
  const { id } = req.params;
  res.json({ 
    message: `Store ${id} deleted`
  });
});

export default router;
