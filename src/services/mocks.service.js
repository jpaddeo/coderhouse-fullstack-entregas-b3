import { faker } from '@faker-js/faker';

import { usersService } from './users.service.js';

export const mocksService = {
  generatePets: async (quantity) => {
    const pets = [];
    for (let i = 0; i <= quantity; i++) {
      const newPet = {
        _id: faker.database.mongodbObjectId(),
        name: faker.animal.petName(),
        specie: i % 2 === 0 ? faker.animal.dog() : faker.animal.cat(),
      };
      pets.push(newPet);
    }
    return pets;
  },
  generateUsers: async (quantity) => {
    const users = [];
    for (let i = 0; i <= quantity; i++) {
      const newUser = {
        _id: faker.database.mongodbObjectId(),
        first_name: faker.person.firstName(),
        last_name: faker.person.lastName(),
        email: faker.internet.email(),
        age: faker.number.int({ min: 18, max: 99 }),
        password: usersService.hashPassword('coder123'),
        role: faker.helpers.arrayElement(['user', 'admin']),
        pets: [],
      };
      users.push(newUser);
    }
    return users;
  },
};
