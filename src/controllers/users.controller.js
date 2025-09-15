import { usersService } from '../services/users.service.js';

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

      if (req.user.role !== 'admin' && req.user._id.toString() !== uid) {
        return res.status(403).json({
          success: false,
          error: 'No tienes permisos para acceder a este recurso',
        });
      }

      const user = await usersService.getById(uid);
      res.status(200).json({
        success: true,
        payload: user,
      });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  },
};
