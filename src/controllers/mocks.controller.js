import { mocksService } from '../services/mocks.service.js';
import { usersService } from '../services/users.service.js';
import { petsService } from '../services/pets.service.js';
import { validateGenerateDataBody } from '../utils/validation.js';

export const mocksController = {
  getPets: async (req, res) => {
    try {
      const quantity = req.params.quantity ?? req.query['quantity'] ?? 100;
      const pets = await mocksService.generatePets(quantity);
      res.status(200).json({
        success: true,
        payload: pets,
      });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  },
  getUsers: async (req, res) => {
    try {
      const quantity = req.params.quantity ?? req.query['quantity'] ?? 100;
      const users = await mocksService.generateUsers(quantity);
      res.status(200).json({
        success: true,
        payload: users,
      });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  },
  generateData: async (req, res) => {
    try {
      
      if (!validateGenerateDataBody(req.body)) {
        return res.status(400).json({
          success: false,
          error: 'El body debe contener las propiedades "users" y "pets"',
        });
      }

      const { users: usersQuantity, pets: petsQuantity } = req.body;

      const usersToInsert = await mocksService.generateUsers(usersQuantity);
      await usersService.createMany(usersToInsert);

      const petsToInsert = await mocksService.generatePets(petsQuantity);
      await petsService.createMany(petsToInsert);

      res.status(201).json({
        success: true,
        message: `Se crearon correctamente ${usersQuantity} usuarios y ${petsQuantity} mascotas`,
        payload: [],
      });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  },
};
