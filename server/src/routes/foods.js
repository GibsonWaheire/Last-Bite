import express from 'express';

const router = express.Router();

// GET /api/foods - Get all available food items
router.get('/', (req, res) => {
  res.json({ 
    message: 'Food items endpoint',
    data: [] // Will be replaced with actual data
  });
});

// GET /api/foods/:id - Get specific food item
router.get('/:id', (req, res) => {
  const { id } = req.params;
  res.json({ 
    message: `Food item ${id}`,
    data: null // Will be replaced with actual data
  });
});

// POST /api/foods - Create new food item
router.post('/', (req, res) => {
  res.json({ 
    message: 'Food item created',
    data: req.body
  });
});

// PUT /api/foods/:id - Update food item
router.put('/:id', (req, res) => {
  const { id } = req.params;
  res.json({ 
    message: `Food item ${id} updated`,
    data: req.body
  });
});

// DELETE /api/foods/:id - Delete food item
router.delete('/:id', (req, res) => {
  const { id } = req.params;
  res.json({ 
    message: `Food item ${id} deleted`
  });
});

export default router;
