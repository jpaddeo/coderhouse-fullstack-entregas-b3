import { Router } from 'express';

import { petsController } from '../controllers/pets.controller.js';

const router = Router();

router.get('/', petsController.getAll);
router.get('/:uid', petsController.get);

export default router;
