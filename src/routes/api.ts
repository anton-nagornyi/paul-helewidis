import express from 'express';
import { bulkValidator } from '../utils/bulkValidator';
import { Controllers } from '../controllers/index';

export const router = express.Router();

router.post('/bulk', bulkValidator(), Controllers.bulk.executeBulkAction);
