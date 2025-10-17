import { Router } from 'express';

import { usersController } from '../controllers/users.controller.js';

import { documentsUploader } from '../utils/uploader.js';

const router = Router();

router.get('/', usersController.getAll);
router.get('/:uid', usersController.get);
router.post('/', usersController.create);
router.post(
  '/:uid/documents',
  documentsUploader.array('documents'),
  usersController.updateDocuments
);
router.put('/:uid', usersController.update);
router.delete('/:uid', usersController.delete);

export default router;
