import { Router } from 'express';

import { adoptionsController } from '../controllers/adoptions.controller.js';

const router = Router();

router.get('/', adoptionsController.getAll);
router.get('/:uid', adoptionsController.get);
router.post('/', adoptionsController.create);
router.put('/:uid', adoptionsController.update);
router.delete('/:uid', adoptionsController.delete);

export default router;
