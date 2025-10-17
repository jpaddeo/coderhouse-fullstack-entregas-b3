import { petsService } from '../services/pets.service.js';

import { __dirname } from '../utils/config.js';

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
  create: async (req, res) => {
    try {
      const pet = await petsService.create(req.body);
      res.status(201).json({
        success: true,
        payload: pet,
      });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  },
  createPetWithImage: async (req, res) => {
    try {
      const file = req.file;
      const { name, specie, birthDate } = req.body;
      if (!name || !specie || !birthDate)
        return res
          .status(400)
          .send({ success: false, error: 'Parámetros inválidos' });
      const pet = await petsService.create({
        name,
        specie,
        birthDate,
        image: `${__dirname}/../../public/pets/${file.filename}`,
      });
      res.status(201).json({
        success: true,
        payload: pet,
      });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  },
  update: async (req, res) => {
    try {
      const { uid } = req.params;

      if (!uid) {
        return res
          .status(400)
          .json({ success: false, error: 'Falta el ID de la mascota' });
      }

      const pet = await petsService.update(uid, req.body);
      res.status(200).json({
        success: true,
        payload: pet,
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
          .json({ success: false, error: 'Falta el ID de la mascota' });

      const response = await petsService.deleted(uid);

      res.status(200).json({
        success: true,
        payload: response,
      });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  },
};
