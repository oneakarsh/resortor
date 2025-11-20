const express = require('express');
const {
  getAllResorts,
  getResortById,
  createResort,
  updateResort,
  deleteResort,
} = require('../controllers/resortController');
const { authMiddleware, adminMiddleware, permissionMiddleware } = require('../middleware/auth');

const router = express.Router();

router.get('/', getAllResorts);
router.get('/:id', getResortById);
router.post('/', authMiddleware, adminMiddleware, permissionMiddleware('create_resort'), createResort);
router.put('/:id', authMiddleware, adminMiddleware, permissionMiddleware('update_resort'), updateResort);
router.delete('/:id', authMiddleware, adminMiddleware, permissionMiddleware('delete_resort'), deleteResort);

module.exports = router;
