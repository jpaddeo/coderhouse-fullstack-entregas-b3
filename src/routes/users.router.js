import { Router } from 'express';

import { usersController } from '../controllers/users.controller.js';

const router = Router();

router.get('/', usersController.getAll);
router.get('/:uid', usersController.get);

export default router;
