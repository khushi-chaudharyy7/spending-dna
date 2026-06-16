import express from 'express';
import multer from 'multer';
import {
  addTransaction,
  getTransactions,
  deleteTransaction,
  uploadCSV,
  analyzeSpending
} from '../controllers/transactionController.js';
import auth from '../middleware/auth.js';

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

router.post('/', auth, addTransaction);
router.get('/', auth, getTransactions);
router.delete('/:id', auth, deleteTransaction);
router.post('/upload-csv', auth, upload.single('file'), uploadCSV);
router.get('/analyze', auth, analyzeSpending);

export default router;