import { petsService } from '../services/pets.service.js';

export const petsController = {
  getAll: async (req, res) => {
    try {
      const pets = await petsService.getAll(req.query);
      res.status(200).json({
        success: true,
        payload: pets,
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

      const pet = await petsService.getById(uid);
      res.status(200).json({
        success: true,
        payload: pet,
      });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  },
};
