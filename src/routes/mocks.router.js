import { Router } from 'express';

import { mocksController } from '../controllers/mocks.controller.js';

const router = Router();

router.get('/mockingpets{/:quantity}', mocksController.getPets);
router.get('/mockingusers{/:quantity}', mocksController.getUsers);
router.post('/generateData', mocksController.generateData);
router.post('/generate-data', mocksController.generateData);

export default router;
