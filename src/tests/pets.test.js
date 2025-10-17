import { expect } from 'chai';
import mongoose from 'mongoose';
import PetsDao from '../dao/pets.dao.js';
import { petModel } from '../dao/models/pet.model.js';
import { petsController } from '../controllers/pets.controller.js';
import { petsService } from '../services/pets.service.js';
import CONFIG from '../utils/config.js';
import { logger } from '../utils/logger.js';

describe('Pets Module Tests', function () {
  this.timeout(5000);

  let petsDao;

  before(async function () {
    if (mongoose.connection.readyState === 0) {
      logger.info(CONFIG.MONGODB_URI);
      await mongoose
        .connect(CONFIG.MONGODB_URI || 'mongodb://localhost:27017/mydb', {})
        .then(() => logger.info('Conectado a MongoDB'))
        .catch((error) => logger.error('Error conectando a MongoDB:', error));
    }
    petsDao = new PetsDao();
  });

  after(async function () {
    await mongoose.connection.close();
  });

  beforeEach(async function () {
    await petModel.deleteMany({});
  });

  // ========================================
  // Capa de acceso a datos
  // ========================================

  describe('PetsDao', function () {
    describe('create()', function () {
      it('should create a new pet successfully', async function () {
        const petData = {
          name: 'Firulais',
          specie: 'Dog',
          birthDate: new Date('2020-01-01'),
        };

        const result = await petsDao.create(petData);

        expect(result).to.be.an('object');
        expect(result).to.have.property('_id');
        expect(result.name).to.equal(petData.name);
        expect(result.specie).to.equal(petData.specie);
        expect(result.adopted).to.equal(false); // Default value
      });

      it('should create a pet with owner', async function () {
        const ownerId = new mongoose.Types.ObjectId();
        const petData = {
          name: 'Michi',
          specie: 'Cat',
          birthDate: new Date('2021-05-15'),
          owner: ownerId,
          adopted: true,
        };

        const result = await petsDao.create(petData);

        expect(result).to.be.an('object');
        expect(result.owner.toString()).to.equal(ownerId.toString());
        expect(result.adopted).to.equal(true);
      });

      it('should create a pet with image', async function () {
        const petData = {
          name: 'Rex',
          specie: 'Dog',
          birthDate: new Date('2019-03-20'),
          image: '/public/pets/rex.jpg',
        };

        const result = await petsDao.create(petData);

        expect(result).to.be.an('object');
        expect(result.image).to.equal(petData.image);
      });

      it('should fail if name is missing', async function () {
        try {
          await petsDao.create({
            specie: 'Dog',
          });
          expect.fail('Should have thrown an error');
        } catch (error) {
          expect(error).to.exist;
        }
      });

      it('should fail if specie is missing', async function () {
        try {
          await petsDao.create({
            name: 'Test Pet',
          });
          expect.fail('Should have thrown an error');
        } catch (error) {
          expect(error).to.exist;
        }
      });
    });

    describe('createMany()', function () {
      it('should create multiple pets at once', async function () {
        const petsData = [
          {
            name: 'Pet 1',
            specie: 'Dog',
            birthDate: new Date('2020-01-01'),
          },
          {
            name: 'Pet 2',
            specie: 'Cat',
            birthDate: new Date('2021-02-02'),
          },
          {
            name: 'Pet 3',
            specie: 'Bird',
            birthDate: new Date('2022-03-03'),
          },
        ];

        const result = await petsDao.createMany(petsData);

        expect(result).to.be.an('array');
        expect(result).to.have.lengthOf(3);
        expect(result[0]).to.have.property('_id');
        expect(result[1]).to.have.property('_id');
        expect(result[2]).to.have.property('_id');
      });

      it('should create empty array if no data provided', async function () {
        const result = await petsDao.createMany([]);
        expect(result).to.be.an('array');
        expect(result).to.have.lengthOf(0);
      });
    });

    describe('get()', function () {
      it('should return all pets when no params provided', async function () {
        // Create test data
        await petsDao.createMany([
          { name: 'Dog 1', specie: 'Dog' },
          { name: 'Cat 1', specie: 'Cat' },
        ]);

        const result = await petsDao.get();

        expect(result).to.be.an('array');
        expect(result).to.have.lengthOf(2);
      });

      it('should filter pets by specie', async function () {
        await petsDao.createMany([
          { name: 'Dog 1', specie: 'Dog' },
          { name: 'Dog 2', specie: 'Dog' },
          { name: 'Cat 1', specie: 'Cat' },
        ]);

        const result = await petsDao.get({ specie: 'Dog' });

        expect(result).to.be.an('array');
        expect(result).to.have.lengthOf(2);
        expect(result[0].specie).to.equal('Dog');
        expect(result[1].specie).to.equal('Dog');
      });

      it('should filter pets by adopted status', async function () {
        await petsDao.createMany([
          { name: 'Adopted 1', specie: 'Dog', adopted: true },
          { name: 'Not Adopted 1', specie: 'Cat', adopted: false },
          { name: 'Not Adopted 2', specie: 'Bird', adopted: false },
        ]);

        const result = await petsDao.get({ adopted: false });

        expect(result).to.be.an('array');
        expect(result).to.have.lengthOf(2);
      });

      it('should return empty array if no pets found', async function () {
        const result = await petsDao.get();

        expect(result).to.be.an('array');
        expect(result).to.have.lengthOf(0);
      });
    });

    describe('getBy()', function () {
      it('should return a single pet by name', async function () {
        await petsDao.create({
          name: 'Unique Pet',
          specie: 'Dog',
        });

        const result = await petsDao.getBy({ name: 'Unique Pet' });

        expect(result).to.be.an('object');
        expect(result.name).to.equal('Unique Pet');
      });

      it('should return a single pet by id', async function () {
        const pet = await petsDao.create({
          name: 'Test Pet',
          specie: 'Cat',
        });

        const result = await petsDao.getBy({ _id: pet._id });

        expect(result).to.be.an('object');
        expect(result._id.toString()).to.equal(pet._id.toString());
      });

      it('should return null if no pet found', async function () {
        const result = await petsDao.getBy({ name: 'Non Existent Pet' });

        expect(result).to.be.null;
      });
    });

    describe('update()', function () {
      it('should update a pet successfully', async function () {
        const pet = await petsDao.create({
          name: 'Old Name',
          specie: 'Dog',
        });

        const result = await petsDao.update(pet._id, {
          name: 'New Name',
        });

        expect(result).to.be.an('object');
        expect(result.modifiedCount).to.equal(1);

        // Verify update
        const updated = await petsDao.getBy({ _id: pet._id });
        expect(updated.name).to.equal('New Name');
      });

      it('should update pet adoption status and owner', async function () {
        const pet = await petsDao.create({
          name: 'Pet to Adopt',
          specie: 'Cat',
        });

        const ownerId = new mongoose.Types.ObjectId();
        await petsDao.update(pet._id, {
          adopted: true,
          owner: ownerId,
        });

        const updated = await petsDao.getBy({ _id: pet._id });
        expect(updated.adopted).to.equal(true);
        expect(updated.owner.toString()).to.equal(ownerId.toString());
      });

      it('should return modifiedCount 0 if pet not found', async function () {
        const result = await petsDao.update(new mongoose.Types.ObjectId(), {
          name: 'New Name',
        });

        expect(result.modifiedCount).to.equal(0);
      });
    });

    describe('delete()', function () {
      it('should delete a pet successfully', async function () {
        const pet = await petsDao.create({
          name: 'Pet to Delete',
          specie: 'Bird',
        });

        const result = await petsDao.delete(pet._id);

        expect(result).to.be.an('object');
        expect(result._id.toString()).to.equal(pet._id.toString());

        // Verify deletion
        const deleted = await petsDao.getBy({ _id: pet._id });
        expect(deleted).to.be.null;
      });

      it('should return null if pet not found', async function () {
        const result = await petsDao.delete(new mongoose.Types.ObjectId());
        expect(result).to.be.null;
      });
    });
  });

  // ========================================
  // Capa de Servicios
  // ========================================

  describe('PetsService', function () {
    describe('getAll()', function () {
      it('should get all pets through service', async function () {
        await petsDao.createMany([
          { name: 'Pet 1', specie: 'Dog' },
          { name: 'Pet 2', specie: 'Cat' },
          { name: 'Pet 3', specie: 'Bird' },
        ]);

        const result = await petsService.getAll();

        expect(result).to.be.an('array');
        expect(result).to.have.lengthOf(3);
      });

      it('should filter by params through service', async function () {
        await petsDao.createMany([
          { name: 'Dog 1', specie: 'Dog' },
          { name: 'Dog 2', specie: 'Dog' },
          { name: 'Cat 1', specie: 'Cat' },
        ]);

        const result = await petsService.getAll({ specie: 'Dog' });

        expect(result).to.be.an('array');
        expect(result).to.have.lengthOf(2);
      });
    });

    describe('getById()', function () {
      it('should get pet by id through service', async function () {
        const pet = await petsDao.create({
          name: 'Test Pet',
          specie: 'Dog',
        });

        const result = await petsService.getById(pet._id);

        expect(result).to.be.an('object');
        expect(result._id.toString()).to.equal(pet._id.toString());
      });

      it('should return null if pet not found', async function () {
        const result = await petsService.getById(new mongoose.Types.ObjectId());

        expect(result).to.be.null;
      });
    });

    describe('create()', function () {
      it('should create pet through service', async function () {
        const petData = {
          name: 'Service Pet',
          specie: 'Cat',
          birthDate: new Date('2022-01-01'),
        };

        const result = await petsService.create(petData);

        expect(result).to.be.an('object');
        expect(result).to.have.property('_id');
        expect(result.name).to.equal(petData.name);
      });
    });

    describe('update()', function () {
      it('should update pet through service', async function () {
        const pet = await petsDao.create({
          name: 'Original Name',
          specie: 'Dog',
        });

        const result = await petsService.update(pet._id, {
          name: 'Updated Name',
        });

        expect(result).to.be.an('object');
        expect(result.modifiedCount).to.equal(1);
      });
    });

    describe('delete()', function () {
      it('should delete pet through service', async function () {
        const pet = await petsDao.create({
          name: 'Pet to Remove',
          specie: 'Bird',
        });

        const result = await petsService.delete(pet._id);

        expect(result).to.be.an('object');
        expect(result._id.toString()).to.equal(pet._id.toString());
      });
    });
  });

  // ========================================
  // Capa de Controladores
  // ========================================

  describe('PetsController', function () {
    let req, res;

    beforeEach(function () {
      req = {
        params: {},
        query: {},
        body: {},
        file: null,
      };

      res = {
        status: function (code) {
          this.statusCode = code;
          return this;
        },
        json: function (data) {
          this.data = data;
          return this;
        },
        send: function (data) {
          this.data = data;
          return this;
        },
      };
    });

    describe('getAll()', function () {
      it('should return all pets with success response', async function () {
        await petsDao.createMany([
          { name: 'Pet 1', specie: 'Dog' },
          { name: 'Pet 2', specie: 'Cat' },
        ]);

        await petsController.getAll(req, res);

        expect(res.statusCode).to.equal(200);
        expect(res.data).to.have.property('success', true);
        expect(res.data).to.have.property('payload');
        expect(res.data.payload).to.be.an('array');
        expect(res.data.payload).to.have.lengthOf(2);
      });

      it('should handle query params for filtering', async function () {
        await petsDao.createMany([
          { name: 'Dog 1', specie: 'Dog' },
          { name: 'Cat 1', specie: 'Cat' },
        ]);

        req.query = { specie: 'Dog' };
        await petsController.getAll(req, res);

        expect(res.statusCode).to.equal(200);
        expect(res.data.success).to.be.true;
        expect(res.data.payload).to.have.lengthOf(1);
      });

      it('should handle errors gracefully', async function () {
        // Force an error by breaking the service
        const originalGetAll = petsService.getAll;
        petsService.getAll = async () => {
          throw new Error('Database error');
        };

        await petsController.getAll(req, res);

        expect(res.statusCode).to.equal(500);
        expect(res.data).to.have.property('success', false);
        expect(res.data).to.have.property('error');

        petsService.getAll = originalGetAll;
      });
    });

    describe('get()', function () {
      it('should return pet by id with success response', async function () {
        const pet = await petsDao.create({
          name: 'Test Pet',
          specie: 'Dog',
        });

        req.params = { uid: pet._id.toString() };
        await petsController.get(req, res);

        expect(res.statusCode).to.equal(200);
        expect(res.data).to.have.property('success', true);
        expect(res.data).to.have.property('payload');
        expect(res.data.payload._id.toString()).to.equal(pet._id.toString());
      });

      it('should return error if uid is missing', async function () {
        req.params = {};
        await petsController.get(req, res);

        expect(res.statusCode).to.equal(400);
        expect(res.data).to.have.property('success', false);
        expect(res.data.error).to.equal('Falta el ID del usuario');
      });

      it('should handle errors gracefully', async function () {
        req.params = { uid: 'invalid-id' };
        await petsController.get(req, res);

        expect(res.statusCode).to.equal(500);
        expect(res.data).to.have.property('success', false);
      });
    });

    describe('create()', function () {
      it('should create pet with success response', async function () {
        req.body = {
          name: 'New Pet',
          specie: 'Cat',
          birthDate: new Date('2023-01-01'),
        };

        await petsController.create(req, res);

        expect(res.statusCode).to.equal(201);
        expect(res.data).to.have.property('success', true);
        expect(res.data).to.have.property('payload');
        expect(res.data.payload).to.have.property('_id');
        expect(res.data.payload.name).to.equal('New Pet');
      });

      it('should handle errors gracefully', async function () {
        req.body = {}; // Missing required fields

        await petsController.create(req, res);

        expect(res.statusCode).to.equal(500);
        expect(res.data).to.have.property('success', false);
      });
    });

    describe('createPetWithImage()', function () {
      it('should create pet with image successfully', async function () {
        req.body = {
          name: 'Pet with Image',
          specie: 'Dog',
          birthDate: new Date('2022-06-15'),
        };
        req.file = {
          filename: 'pet-image.jpg',
        };

        await petsController.createPetWithImage(req, res);

        expect(res.statusCode).to.equal(201);
        expect(res.data).to.have.property('success', true);
        expect(res.data.payload).to.have.property('image');
        expect(res.data.payload.image).to.include('pet-image.jpg');
      });

      it('should return error if name is missing', async function () {
        req.body = {
          specie: 'Dog',
          birthDate: new Date(),
        };
        req.file = { filename: 'test.jpg' };

        await petsController.createPetWithImage(req, res);

        expect(res.statusCode).to.equal(400);
        expect(res.data).to.have.property('success', false);
        expect(res.data.error).to.equal('Parámetros inválidos');
      });

      it('should return error if specie is missing', async function () {
        req.body = {
          name: 'Test Pet',
          birthDate: new Date(),
        };
        req.file = { filename: 'test.jpg' };

        await petsController.createPetWithImage(req, res);

        expect(res.statusCode).to.equal(400);
        expect(res.data).to.have.property('success', false);
      });

      it('should return error if birthDate is missing', async function () {
        req.body = {
          name: 'Test Pet',
          specie: 'Dog',
        };
        req.file = { filename: 'test.jpg' };

        await petsController.createPetWithImage(req, res);

        expect(res.statusCode).to.equal(400);
        expect(res.data).to.have.property('success', false);
      });

      it('should handle errors gracefully', async function () {
        req.body = {
          name: 'Test Pet',
          specie: 'Dog',
          birthDate: new Date(),
        };
        req.file = { filename: 'test.jpg' };

        // Force an error
        const originalCreate = petsService.create;
        petsService.create = async () => {
          throw new Error('Upload error');
        };

        await petsController.createPetWithImage(req, res);

        expect(res.statusCode).to.equal(500);
        expect(res.data).to.have.property('success', false);

        // Restore
        petsService.create = originalCreate;
      });
    });

    describe('update()', function () {
      it('should update pet with success response', async function () {
        const pet = await petsDao.create({
          name: 'Original Pet',
          specie: 'Dog',
        });

        req.params = { uid: pet._id.toString() };
        req.body = { name: 'Updated Pet' };

        await petsController.update(req, res);

        expect(res.statusCode).to.equal(200);
        expect(res.data).to.have.property('success', true);
        expect(res.data).to.have.property('payload');
      });

      it('should return error if uid is missing', async function () {
        req.params = {};
        req.body = { name: 'Updated Pet' };

        await petsController.update(req, res);

        expect(res.statusCode).to.equal(400);
        expect(res.data).to.have.property('success', false);
        expect(res.data.error).to.equal('Falta el ID de la mascota');
      });

      it('should handle errors gracefully', async function () {
        req.params = { uid: 'invalid-id' };
        req.body = { name: 'Updated Pet' };

        await petsController.update(req, res);

        expect(res.statusCode).to.equal(500);
        expect(res.data).to.have.property('success', false);
      });
    });

    describe('delete()', function () {
      it('should delete pet with success response', async function () {
        const pet = await petsDao.create({
          name: 'Pet to Delete',
          specie: 'Cat',
        });

        req.params = { uid: pet._id.toString() };

        await petsController.delete(req, res);

        expect(res.statusCode).to.equal(200);
        expect(res.data).to.have.property('success', true);
        expect(res.data).to.have.property('payload');
      });

      it('should return error if uid is missing', async function () {
        req.params = {};

        await petsController.delete(req, res);

        expect(res.statusCode).to.equal(400);
        expect(res.data).to.have.property('success', false);
        expect(res.data.error).to.equal('Falta el ID de la mascota');
      });

      it('should handle errors gracefully', async function () {
        req.params = { uid: 'invalid-id' };

        await petsController.delete(req, res);

        expect(res.statusCode).to.equal(500);
        expect(res.data).to.have.property('success', false);
      });
    });
  });

  // ========================================
  // Integración
  // ========================================

  describe('Integration Tests', function () {
    it('should complete full CRUD cycle', async function () {
      const created = await petsService.create({
        name: 'Integration Test Pet',
        specie: 'Dog',
        birthDate: new Date('2021-01-01'),
      });
      expect(created).to.have.property('_id');
      expect(created.adopted).to.equal(false);

      const found = await petsService.getById(created._id);
      expect(found).to.not.be.null;
      expect(found._id.toString()).to.equal(created._id.toString());

      await petsService.update(created._id, { name: 'Updated Pet Name' });
      const updated = await petsService.getById(created._id);
      expect(updated.name).to.equal('Updated Pet Name');

      await petsService.delete(created._id);
      const deleted = await petsService.getById(created._id);
      expect(deleted).to.be.null;
    });

    it('should handle pet adoption workflow', async function () {
      const pet = await petsService.create({
        name: 'Pet to Adopt',
        specie: 'Cat',
      });

      expect(pet.adopted).to.equal(false);
      expect(pet.owner).to.be.undefined;

      const ownerId = new mongoose.Types.ObjectId();
      await petsService.update(pet._id, {
        adopted: true,
        owner: ownerId,
      });

      const adopted = await petsService.getById(pet._id);
      expect(adopted.adopted).to.equal(true);
      expect(adopted.owner.toString()).to.equal(ownerId.toString());
    });

    it('should handle multiple pets of same specie', async function () {
      await petsService.create({ name: 'Dog 1', specie: 'Dog' });
      await petsService.create({ name: 'Dog 2', specie: 'Dog' });
      await petsService.create({ name: 'Cat 1', specie: 'Cat' });

      const dogs = await petsService.getAll({ specie: 'Dog' });
      expect(dogs).to.have.lengthOf(2);

      const cats = await petsService.getAll({ specie: 'Cat' });
      expect(cats).to.have.lengthOf(1);
    });

    it('should filter adopted vs non-adopted pets', async function () {
      const ownerId = new mongoose.Types.ObjectId();

      await petsService.create({
        name: 'Adopted 1',
        specie: 'Dog',
        adopted: true,
        owner: ownerId,
      });

      await petsService.create({
        name: 'Not Adopted 1',
        specie: 'Cat',
        adopted: false,
      });

      await petsService.create({
        name: 'Not Adopted 2',
        specie: 'Bird',
        adopted: false,
      });

      const adoptedPets = await petsService.getAll({ adopted: true });
      expect(adoptedPets).to.have.lengthOf(1);

      const availablePets = await petsService.getAll({ adopted: false });
      expect(availablePets).to.have.lengthOf(2);
    });

    it('should handle pet with image path', async function () {
      const petWithImage = await petsService.create({
        name: 'Pet with Photo',
        specie: 'Dog',
        image: '/public/pets/dog-photo.jpg',
      });

      expect(petWithImage.image).to.equal('/public/pets/dog-photo.jpg');

      const found = await petsService.getById(petWithImage._id);
      expect(found.image).to.equal('/public/pets/dog-photo.jpg');
    });
  });

  describe('Edge Cases', function () {
    it('should handle very long pet names', async function () {
      const longName = 'A'.repeat(100);
      const pet = await petsService.create({
        name: longName,
        specie: 'Dog',
      });

      expect(pet.name).to.equal(longName);
    });

    it('should handle special characters in name', async function () {
      const specialName = 'Ñoño-Señor_Pet123!';
      const pet = await petsService.create({
        name: specialName,
        specie: 'Cat',
      });

      expect(pet.name).to.equal(specialName);
    });

    it('should handle future birth dates', async function () {
      const futureDate = new Date('2030-01-01');
      const pet = await petsService.create({
        name: 'Future Pet',
        specie: 'Dog',
        birthDate: futureDate,
      });

      expect(pet.birthDate.getTime()).to.equal(futureDate.getTime());
    });

    it('should handle multiple updates on same pet', async function () {
      const pet = await petsService.create({
        name: 'Original',
        specie: 'Dog',
      });

      await petsService.update(pet._id, { name: 'Update 1' });
      await petsService.update(pet._id, { name: 'Update 2' });
      await petsService.update(pet._id, { name: 'Final Update' });

      const updated = await petsService.getById(pet._id);
      expect(updated.name).to.equal('Final Update');
    });
  });
});
