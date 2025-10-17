import { expect } from 'chai';
import mongoose from 'mongoose';
import AdoptionsDao from '../dao/adoptions.dao.js';
import { adoptionModel } from '../dao/models/adoption.model.js';
import { adoptionsController } from '../controllers/adoptions.controller.js';
import { adoptionsService } from '../services/adoptions.service.js';
import CONFIG from '../utils/config.js';
import { logger } from '../utils/logger.js';

describe('Adoptions Module Tests', function () {
  this.timeout(5000);

  let adoptionsDao;

  before(async function () {
    if (mongoose.connection.readyState === 0) {
      logger.info(CONFIG.MONGODB_URI);
      await mongoose
        .connect(CONFIG.MONGODB_URI || 'mongodb://localhost:27017/mydb', {})
        .then(() => logger.info('Conectado a MongoDB'))
        .catch((error) => logger.error('Error conectando a MongoDB:', error));
    }
    adoptionsDao = new AdoptionsDao();
  });

  after(async function () {
    await mongoose.connection.close();
  });

  beforeEach(async function () {
    await adoptionModel.deleteMany({});
  });

  // ========================================
  // Capa de acceso a datos
  // ========================================

  describe('AdoptionsDao', function () {
    describe('create()', function () {
      it('should create a new adoption successfully', async function () {
        const adoptionData = {
          owner: new mongoose.Types.ObjectId(),
          pet: new mongoose.Types.ObjectId(),
        };

        const result = await adoptionsDao.create(adoptionData);

        expect(result).to.be.an('object');
        expect(result).to.have.property('_id');
        expect(result.owner.toString()).to.equal(adoptionData.owner.toString());
        expect(result.pet.toString()).to.equal(adoptionData.pet.toString());
      });

      it('should fail if required fields are missing', async function () {
        try {
          await adoptionsDao.create({});
          expect.fail('Should have thrown an error');
        } catch (error) {
          expect(error).to.exist;
        }
      });
    });

    describe('createMany()', function () {
      it('should create multiple adoptions at once', async function () {
        const adoptionsData = [
          {
            owner: new mongoose.Types.ObjectId(),
            pet: new mongoose.Types.ObjectId(),
          },
          {
            owner: new mongoose.Types.ObjectId(),
            pet: new mongoose.Types.ObjectId(),
          },
        ];

        const result = await adoptionsDao.createMany(adoptionsData);

        expect(result).to.be.an('array');
        expect(result).to.have.lengthOf(2);
        expect(result[0]).to.have.property('_id');
        expect(result[1]).to.have.property('_id');
      });

      it('should create empty array if no data provided', async function () {
        const result = await adoptionsDao.createMany([]);
        expect(result).to.be.an('array');
        expect(result).to.have.lengthOf(0);
      });
    });

    describe('get()', function () {
      it('should return all adoptions when no params provided', async function () {
        await adoptionsDao.createMany([
          {
            owner: new mongoose.Types.ObjectId(),
            pet: new mongoose.Types.ObjectId(),
          },
          {
            owner: new mongoose.Types.ObjectId(),
            pet: new mongoose.Types.ObjectId(),
          },
        ]);

        const result = await adoptionsDao.get();

        expect(result).to.be.an('array');
        expect(result).to.have.lengthOf(2);
      });

      it('should filter adoptions by params', async function () {
        const ownerId = new mongoose.Types.ObjectId();
        await adoptionsDao.createMany([
          {
            owner: ownerId,
            pet: new mongoose.Types.ObjectId(),
          },
          {
            owner: new mongoose.Types.ObjectId(),
            pet: new mongoose.Types.ObjectId(),
          },
        ]);

        const result = await adoptionsDao.get({ owner: ownerId });

        expect(result).to.be.an('array');
        expect(result).to.have.lengthOf(1);
        expect(result[0].owner.toString()).to.equal(ownerId.toString());
      });

      it('should return empty array if no adoptions found', async function () {
        const result = await adoptionsDao.get();

        expect(result).to.be.an('array');
        expect(result).to.have.lengthOf(0);
      });
    });

    describe('getBy()', function () {
      it('should return a single adoption by params', async function () {
        const ownerId = new mongoose.Types.ObjectId();
        const petId = new mongoose.Types.ObjectId();

        await adoptionsDao.create({
          owner: ownerId,
          pet: petId,
        });

        const result = await adoptionsDao.getBy({ owner: ownerId });

        expect(result).to.be.an('object');
        expect(result.owner.toString()).to.equal(ownerId.toString());
      });

      it('should return null if no adoption found', async function () {
        const result = await adoptionsDao.getBy({
          owner: new mongoose.Types.ObjectId(),
        });

        expect(result).to.be.null;
      });
    });

    describe('update()', function () {
      it('should update an adoption successfully', async function () {
        const adoption = await adoptionsDao.create({
          owner: new mongoose.Types.ObjectId(),
          pet: new mongoose.Types.ObjectId(),
        });

        const newPetId = new mongoose.Types.ObjectId();
        const result = await adoptionsDao.update(adoption._id, {
          pet: newPetId,
        });

        expect(result).to.be.an('object');
        expect(result.modifiedCount).to.equal(1);

        // Verify update
        const updated = await adoptionsDao.getBy({ _id: adoption._id });
        expect(updated.pet.toString()).to.equal(newPetId.toString());
      });

      it('should return modifiedCount 0 if adoption not found', async function () {
        const result = await adoptionsDao.update(
          new mongoose.Types.ObjectId(),
          {
            pet: new mongoose.Types.ObjectId(),
          }
        );

        expect(result.modifiedCount).to.equal(0);
      });
    });

    describe('delete()', function () {
      it('should delete an adoption successfully', async function () {
        const adoption = await adoptionsDao.create({
          owner: new mongoose.Types.ObjectId(),
          pet: new mongoose.Types.ObjectId(),
        });

        const result = await adoptionsDao.delete(adoption._id);

        expect(result).to.be.an('object');
        expect(result._id.toString()).to.equal(adoption._id.toString());

        // Verify deletion
        const deleted = await adoptionsDao.getBy({ _id: adoption._id });
        expect(deleted).to.be.null;
      });

      it('should return null if adoption not found', async function () {
        const result = await adoptionsDao.delete(new mongoose.Types.ObjectId());
        expect(result).to.be.null;
      });
    });
  });

  // ========================================
  // Capa de Servicios
  // ========================================

  describe('AdoptionsService', function () {
    describe('getAll()', function () {
      it('should get all adoptions through service', async function () {
        await adoptionsDao.createMany([
          {
            owner: new mongoose.Types.ObjectId(),
            pet: new mongoose.Types.ObjectId(),
          },
          {
            owner: new mongoose.Types.ObjectId(),
            pet: new mongoose.Types.ObjectId(),
          },
        ]);

        const result = await adoptionsService.getAll();

        expect(result).to.be.an('array');
        expect(result).to.have.lengthOf(2);
      });

      it('should filter by params through service', async function () {
        const ownerId = new mongoose.Types.ObjectId();
        await adoptionsDao.create({
          owner: ownerId,
          pet: new mongoose.Types.ObjectId(),
        });

        const result = await adoptionsService.getAll({ owner: ownerId });

        expect(result).to.be.an('array');
        expect(result).to.have.lengthOf(1);
      });
    });

    describe('getById()', function () {
      it('should get adoption by id through service', async function () {
        const adoption = await adoptionsDao.create({
          owner: new mongoose.Types.ObjectId(),
          pet: new mongoose.Types.ObjectId(),
        });

        const result = await adoptionsService.getById(adoption._id);

        expect(result).to.be.an('object');
        expect(result._id.toString()).to.equal(adoption._id.toString());
      });

      it('should return null if adoption not found', async function () {
        const result = await adoptionsService.getById(
          new mongoose.Types.ObjectId()
        );

        expect(result).to.be.null;
      });
    });

    describe('create()', function () {
      it('should create adoption through service', async function () {
        const adoptionData = {
          owner: new mongoose.Types.ObjectId(),
          pet: new mongoose.Types.ObjectId(),
        };

        const result = await adoptionsService.create(adoptionData);

        expect(result).to.be.an('object');
        expect(result).to.have.property('_id');
        expect(result.owner.toString()).to.equal(adoptionData.owner.toString());
      });
    });

    describe('update()', function () {
      it('should update adoption through service', async function () {
        const adoption = await adoptionsDao.create({
          owner: new mongoose.Types.ObjectId(),
          pet: new mongoose.Types.ObjectId(),
        });

        const newPetId = new mongoose.Types.ObjectId();
        const result = await adoptionsService.update(adoption._id, {
          pet: newPetId,
        });

        expect(result).to.be.an('object');
        expect(result.modifiedCount).to.equal(1);
      });
    });

    describe('delete()', function () {
      it('should delete adoption through service', async function () {
        const adoption = await adoptionsDao.create({
          owner: new mongoose.Types.ObjectId(),
          pet: new mongoose.Types.ObjectId(),
        });

        const result = await adoptionsService.delete(adoption._id);

        expect(result).to.be.an('object');
        expect(result._id.toString()).to.equal(adoption._id.toString());
      });
    });
  });

  // ========================================
  // Capa de controllers
  // ========================================

  describe('AdoptionsController', function () {
    let req, res;

    beforeEach(function () {
      req = {
        params: {},
        query: {},
        body: {},
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
      };
    });

    describe('getAll()', function () {
      it('should return all adoptions with success response', async function () {
        await adoptionsDao.createMany([
          {
            owner: new mongoose.Types.ObjectId(),
            pet: new mongoose.Types.ObjectId(),
          },
          {
            owner: new mongoose.Types.ObjectId(),
            pet: new mongoose.Types.ObjectId(),
          },
        ]);

        await adoptionsController.getAll(req, res);

        expect(res.statusCode).to.equal(200);
        expect(res.data).to.have.property('success', true);
        expect(res.data).to.have.property('payload');
        expect(res.data.payload).to.be.an('array');
        expect(res.data.payload).to.have.lengthOf(2);
      });

      it('should handle query params for filtering', async function () {
        const ownerId = new mongoose.Types.ObjectId();
        await adoptionsDao.create({
          owner: ownerId,
          pet: new mongoose.Types.ObjectId(),
        });

        req.query = { owner: ownerId };
        await adoptionsController.getAll(req, res);

        expect(res.statusCode).to.equal(200);
        expect(res.data.success).to.be.true;
        expect(res.data.payload).to.have.lengthOf(1);
      });

      it('should handle errors gracefully', async function () {
        const originalGetAll = adoptionsService.getAll;
        adoptionsService.getAll = async () => {
          throw new Error('Database error');
        };

        await adoptionsController.getAll(req, res);

        expect(res.statusCode).to.equal(500);
        expect(res.data).to.have.property('success', false);
        expect(res.data).to.have.property('error');

        adoptionsService.getAll = originalGetAll;
      });
    });

    describe('get()', function () {
      it('should return adoption by id with success response', async function () {
        const adoption = await adoptionsDao.create({
          owner: new mongoose.Types.ObjectId(),
          pet: new mongoose.Types.ObjectId(),
        });

        req.params = { uid: adoption._id.toString() };
        await adoptionsController.get(req, res);

        expect(res.statusCode).to.equal(200);
        expect(res.data).to.have.property('success', true);
        expect(res.data).to.have.property('payload');
        expect(res.data.payload._id.toString()).to.equal(
          adoption._id.toString()
        );
      });

      it('should return error if uid is missing', async function () {
        req.params = {};
        await adoptionsController.get(req, res);

        expect(res.statusCode).to.equal(400);
        expect(res.data).to.have.property('success', false);
        expect(res.data.error).to.equal('Falta el ID de la adopción');
      });

      it('should handle errors gracefully', async function () {
        req.params = { uid: 'invalid-id' };
        await adoptionsController.get(req, res);

        expect(res.statusCode).to.equal(500);
        expect(res.data).to.have.property('success', false);
      });
    });

    describe('create()', function () {
      it('should create adoption with success response', async function () {
        req.body = {
          owner: new mongoose.Types.ObjectId(),
          pet: new mongoose.Types.ObjectId(),
        };

        await adoptionsController.create(req, res);

        expect(res.statusCode).to.equal(201);
        expect(res.data).to.have.property('success', true);
        expect(res.data).to.have.property('payload');
        expect(res.data.payload).to.have.property('_id');
      });

      it('should handle errors gracefully', async function () {
        req.body = {};

        await adoptionsController.create(req, res);

        expect(res.statusCode).to.equal(500);
        expect(res.data).to.have.property('success', false);
      });
    });

    describe('update()', function () {
      it('should update adoption with success response', async function () {
        const adoption = await adoptionsDao.create({
          owner: new mongoose.Types.ObjectId(),
          pet: new mongoose.Types.ObjectId(),
        });

        req.params = { uid: adoption._id.toString() };
        req.body = { pet: new mongoose.Types.ObjectId() };

        await adoptionsController.update(req, res);

        expect(res.statusCode).to.equal(200);
        expect(res.data).to.have.property('success', true);
        expect(res.data).to.have.property('payload');
      });

      it('should return error if uid is missing', async function () {
        req.params = {};
        req.body = { pet: new mongoose.Types.ObjectId() };

        await adoptionsController.update(req, res);

        expect(res.statusCode).to.equal(400);
        expect(res.data).to.have.property('success', false);
        expect(res.data.error).to.equal('Falta el ID de la adopción');
      });
    });

    describe('delete()', function () {
      it('should delete adoption with success response', async function () {
        const adoption = await adoptionsDao.create({
          owner: new mongoose.Types.ObjectId(),
          pet: new mongoose.Types.ObjectId(),
        });

        req.params = { uid: adoption._id.toString() };

        await adoptionsController.delete(req, res);

        expect(res.statusCode).to.equal(200);
        expect(res.data).to.have.property('success', true);
        expect(res.data).to.have.property('payload');
      });

      it('should return error if uid is missing', async function () {
        req.params = {};

        await adoptionsController.delete(req, res);

        expect(res.statusCode).to.equal(400);
        expect(res.data).to.have.property('success', false);
        expect(res.data.error).to.equal('Falta el ID de la adopción');
      });

      it('should handle errors gracefully', async function () {
        req.params = { uid: 'invalid-id' };

        await adoptionsController.delete(req, res);

        expect(res.statusCode).to.equal(500);
        expect(res.data).to.have.property('success', false);
      });
    });
  });

  // ========================================
  // Tests de integración de services
  // ========================================

  describe('Integration Tests', function () {
    it('should complete full CRUD cycle', async function () {
      const ownerId = new mongoose.Types.ObjectId();
      const petId = new mongoose.Types.ObjectId();

      const created = await adoptionsService.create({
        owner: ownerId,
        pet: petId,
      });
      expect(created).to.have.property('_id');

      const found = await adoptionsService.getById(created._id);
      expect(found).to.not.be.null;
      expect(found._id.toString()).to.equal(created._id.toString());

      const newPetId = new mongoose.Types.ObjectId();
      await adoptionsService.update(created._id, { pet: newPetId });
      const updated = await adoptionsService.getById(created._id);
      expect(updated.pet.toString()).to.equal(newPetId.toString());

      await adoptionsService.delete(created._id);
      const deleted = await adoptionsService.getById(created._id);
      expect(deleted).to.be.null;
    });

    it('should handle multiple adoptions for same owner', async function () {
      const ownerId = new mongoose.Types.ObjectId();

      await adoptionsService.create({
        owner: ownerId,
        pet: new mongoose.Types.ObjectId(),
      });

      await adoptionsService.create({
        owner: ownerId,
        pet: new mongoose.Types.ObjectId(),
      });

      const adoptions = await adoptionsService.getAll({ owner: ownerId });
      expect(adoptions).to.have.lengthOf(2);
    });
  });
});
