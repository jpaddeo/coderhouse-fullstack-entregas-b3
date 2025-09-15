import PetsDao from '../dao/pets.dao.js';

import PetsRepository from './repositories/pets.repository.js';

export const petsService = new PetsRepository(new PetsDao());
