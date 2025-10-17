import { adoptionsService } from '../services/adoptions.service.js';

export const adoptionsController = {
  getAll: async (req, res) => {
    try {
      const adoptions = await adoptionsService.getAll(req.query);
      res.status(200).json({
        success: true,
        payload: adoptions,
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
          .json({ success: false, error: 'Falta el ID de la adopción' });

      const adoption = await adoptionsService.getById(uid);
      res.status(200).json({
        success: true,
        payload: adoption,
      });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  },
  create: async (req, res) => {
    try {
      const adoption = await adoptionsService.create(req.body);
      res.status(201).json({
        success: true,
        payload: adoption,
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
          .json({ success: false, error: 'Falta el ID de la adopción' });

      const adoption = await adoptionsService.update(uid, req.body);
      res.status(200).json({
        success: true,
        payload: adoption,
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
          .json({ success: false, error: 'Falta el ID de la adopción' });

      const response = await adoptionsService.delete(uid);

      res.status(200).json({
        success: true,
        payload: response,
      });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  },
};
