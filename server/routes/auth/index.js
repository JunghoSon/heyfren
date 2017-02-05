import express from 'express';
import controller from './controller';
import authMiddleware from '../../middlewares/auth';

const router = express.Router();

router.post('/register', controller.register);
router.post('/login', controller.login);

router.use('/check', authMiddleware);
router.get('/chek', controller.check);

export default router;
