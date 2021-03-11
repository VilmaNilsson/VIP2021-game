// Example Router
const express = require('express');

const router = express.Router();

router.get('/', (req, res) => {
  res.send('1: Sebbe');
});

router.get('/:id', (req, res) => {
  res.send(`Still sebbe, but got ${req.params.id}`);
});

module.exports = router;
