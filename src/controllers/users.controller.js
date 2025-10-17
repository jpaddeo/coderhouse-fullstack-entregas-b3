import { usersService } from '../services/users.service.js';

import { __dirname } from '../utils/config.js';

export const usersController = {
  getAll: async (req, res) => {
    try {
      const users = await usersService.getAll(req.query);
      res.status(200).json({
        success: true,
        payload: users,
      });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  },
  get: async (req, res) => {
    try {
      const { uid } = req.params;

      if (!uid)
        return res
          .status(400)
          .json({ success: false, error: 'Falta el ID del usuario' });

      const user = await usersService.getById(uid);
      res.status(200).json({
        success: true,
        payload: user,
      });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  },
  create: async (req, res) => {
    try {
      const user = await usersService.create(req.body);
      res.status(201).json({
        success: true,
        payload: user,
      });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  },
  update: async (req, res) => {
    try {
      const { uid } = req.params;

      if (!uid)
        return res
          .status(400)
          .json({ success: false, error: 'Falta el ID del usuario' });

      const user = await usersService.update(uid, req.body);
      res.status(200).json({
        success: true,
        payload: user,
      });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  },
  updateDocuments: async (req, res) => {
    try {
      const { uid } = req.params;

      if (!uid)
        return res
          .status(400)
          .json({ success: false, error: 'Falta el ID del usuario' });

      const documents = req.files.map((file) => ({
        name: file.originalname,
        reference: `${__dirname}/../../public/documents/${file.filename}`,
      }));

      const user = await usersService.update(uid, { documents });
      res.status(200).json({
        success: true,
        payload: user,
      });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  },
  delete: async (req, res) => {
    try {
      const { uid } = req.params;

      if (!uid)
        return res
          .status(400)
          .json({ success: false, error: 'Falta el ID del usuario' });

      const response = await usersService.deleted(uid);

      res.status(200).json({
        success: true,
        payload: response,
      });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  },
};
