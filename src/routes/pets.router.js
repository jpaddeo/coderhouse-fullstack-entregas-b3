import { Router } from 'express';

import { petsController } from '../controllers/pets.controller.js';
import { imageUploader } from '../utils/uploader.js';

const router = Router();

router.get('/', petsController.getAll);
router.get('/:uid', petsController.get);
router.post('/', petsController.create);
router.post(
  '/withimage',
  imageUploader.single('image'),
  petsController.createPetWithImage
);
router.put('/:uid', petsController.update);
router.delete('/:uid', petsController.delete);

export default router;
