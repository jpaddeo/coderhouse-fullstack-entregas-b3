import { expect } from 'chai';
import mongoose from 'mongoose';
import UsersDao from '../dao/users.dao.js';
import { userModel } from '../dao/models/user.model.js';
import { usersController } from '../controllers/users.controller.js';
import { usersService } from '../services/users.service.js';
import CONFIG from '../utils/config.js';
import { logger } from '../utils/logger.js';

describe('Users Module Tests', function () {
  this.timeout(5000);

  let usersDao;

  before(async function () {
    // Connect to test database
    if (mongoose.connection.readyState === 0) {
      logger.info(CONFIG.MONGODB_URI);
      await mongoose
        .connect(CONFIG.MONGODB_URI || 'mongodb://localhost:27017/mydb', {})
        .then(() => logger.info('Conectado a MongoDB'))
        .catch((error) => logger.error('Error conectando a MongoDB:', error));
    }
    usersDao = new UsersDao();
  });

  after(async function () {
    // Clean up and disconnect
    await mongoose.connection.close();
  });

  beforeEach(async function () {
    // Clear users collection before each test
    await userModel.deleteMany({});
  });

  // ========================================
  // DAO Layer Tests
  // ========================================

  describe('UsersDao', function () {
    describe('create()', function () {
      it('should create a new user successfully', async function () {
        const userData = {
          first_name: 'Juan',
          last_name: 'Pérez',
          email: 'juan@example.com',
          age: 30,
          password: 'hashedPassword123',
        };

        const result = await usersDao.create(userData);

        expect(result).to.be.an('object');
        expect(result).to.have.property('_id');
        expect(result.first_name).to.equal(userData.first_name);
        expect(result.last_name).to.equal(userData.last_name);
        expect(result.email).to.equal(userData.email);
        expect(result.age).to.equal(userData.age);
        expect(result.role).to.equal('user'); // Default value
        expect(result.pets).to.be.an('array').that.is.empty;
        expect(result.documents).to.be.an('array').that.is.empty;
      });

      it('should create a user with custom role', async function () {
        const userData = {
          first_name: 'Admin',
          last_name: 'User',
          email: 'admin@example.com',
          age: 35,
          password: 'hashedPassword123',
          role: 'admin',
        };

        const result = await usersDao.create(userData);

        expect(result).to.be.an('object');
        expect(result.role).to.equal('admin');
      });

      it('should create a user with pets', async function () {
        const petId = new mongoose.Types.ObjectId();
        const userData = {
          first_name: 'Pet',
          last_name: 'Owner',
          email: 'petowner@example.com',
          age: 28,
          password: 'hashedPassword123',
          pets: [{ pet: petId }],
        };

        const result = await usersDao.create(userData);

        expect(result).to.be.an('object');
        expect(result.pets).to.be.an('array').with.lengthOf(1);
        expect(result.pets[0].pet.toString()).to.equal(petId.toString());
      });

      it('should create a user with documents', async function () {
        const userData = {
          first_name: 'Doc',
          last_name: 'Owner',
          email: 'docowner@example.com',
          age: 40,
          password: 'hashedPassword123',
          documents: [
            { name: 'ID.pdf', reference: '/public/documents/id.pdf' },
            { name: 'Proof.pdf', reference: '/public/documents/proof.pdf' },
          ],
        };

        const result = await usersDao.create(userData);

        expect(result).to.be.an('object');
        expect(result.documents).to.be.an('array').with.lengthOf(2);
        expect(result.documents[0].name).to.equal('ID.pdf');
        expect(result.documents[1].name).to.equal('Proof.pdf');
      });

      it('should fail if first_name is missing', async function () {
        try {
          await usersDao.create({
            last_name: 'Test',
            email: 'test@example.com',
            age: 25,
            password: 'pass123',
          });
          expect.fail('Should have thrown an error');
        } catch (error) {
          expect(error).to.exist;
        }
      });

      it('should fail if last_name is missing', async function () {
        try {
          await usersDao.create({
            first_name: 'Test',
            email: 'test@example.com',
            age: 25,
            password: 'pass123',
          });
          expect.fail('Should have thrown an error');
        } catch (error) {
          expect(error).to.exist;
        }
      });

      it('should fail if email is missing', async function () {
        try {
          await usersDao.create({
            first_name: 'Test',
            last_name: 'User',
            age: 25,
            password: 'pass123',
          });
          expect.fail('Should have thrown an error');
        } catch (error) {
          expect(error).to.exist;
        }
      });

      it('should fail if email is duplicate', async function () {
        const userData = {
          first_name: 'Test',
          last_name: 'User',
          email: 'duplicate@example.com',
          age: 25,
          password: 'pass123',
        };

        await usersDao.create(userData);

        try {
          await usersDao.create(userData);
          expect.fail('Should have thrown an error');
        } catch (error) {
          expect(error).to.exist;
          expect(error.code).to.equal(11000); // Duplicate key error
        }
      });

      it('should fail if age is missing', async function () {
        try {
          await usersDao.create({
            first_name: 'Test',
            last_name: 'User',
            email: 'test@example.com',
            password: 'pass123',
          });
          expect.fail('Should have thrown an error');
        } catch (error) {
          expect(error).to.exist;
        }
      });

      it('should fail if password is missing', async function () {
        try {
          await usersDao.create({
            first_name: 'Test',
            last_name: 'User',
            email: 'test@example.com',
            age: 25,
          });
          expect.fail('Should have thrown an error');
        } catch (error) {
          expect(error).to.exist;
        }
      });
    });

    describe('createMany()', function () {
      it('should create multiple users at once', async function () {
        const usersData = [
          {
            first_name: 'User1',
            last_name: 'Test',
            email: 'user1@example.com',
            age: 25,
            password: 'pass1',
          },
          {
            first_name: 'User2',
            last_name: 'Test',
            email: 'user2@example.com',
            age: 30,
            password: 'pass2',
          },
          {
            first_name: 'User3',
            last_name: 'Test',
            email: 'user3@example.com',
            age: 35,
            password: 'pass3',
          },
        ];

        const result = await usersDao.createMany(usersData);

        expect(result).to.be.an('array');
        expect(result).to.have.lengthOf(3);
        expect(result[0]).to.have.property('_id');
        expect(result[1]).to.have.property('_id');
        expect(result[2]).to.have.property('_id');
      });

      it('should create empty array if no data provided', async function () {
        const result = await usersDao.createMany([]);
        expect(result).to.be.an('array');
        expect(result).to.have.lengthOf(0);
      });
    });

    describe('get()', function () {
      it('should return all users when no params provided', async function () {
        await usersDao.createMany([
          {
            first_name: 'User1',
            last_name: 'Test',
            email: 'user1@example.com',
            age: 25,
            password: 'pass1',
          },
          {
            first_name: 'User2',
            last_name: 'Test',
            email: 'user2@example.com',
            age: 30,
            password: 'pass2',
          },
        ]);

        const result = await usersDao.get();

        expect(result).to.be.an('array');
        expect(result).to.have.lengthOf(2);
      });

      it('should filter users by role', async function () {
        await usersDao.createMany([
          {
            first_name: 'Admin1',
            last_name: 'Test',
            email: 'admin1@example.com',
            age: 30,
            password: 'pass1',
            role: 'admin',
          },
          {
            first_name: 'User1',
            last_name: 'Test',
            email: 'user1@example.com',
            age: 25,
            password: 'pass2',
            role: 'user',
          },
          {
            first_name: 'Admin2',
            last_name: 'Test',
            email: 'admin2@example.com',
            age: 35,
            password: 'pass3',
            role: 'admin',
          },
        ]);

        const result = await usersDao.get({ role: 'admin' });

        expect(result).to.be.an('array');
        expect(result).to.have.lengthOf(2);
        expect(result[0].role).to.equal('admin');
        expect(result[1].role).to.equal('admin');
      });

      it('should filter users by email', async function () {
        await usersDao.create({
          first_name: 'Test',
          last_name: 'User',
          email: 'specific@example.com',
          age: 25,
          password: 'pass1',
        });

        const result = await usersDao.get({ email: 'specific@example.com' });

        expect(result).to.be.an('array');
        expect(result).to.have.lengthOf(1);
        expect(result[0].email).to.equal('specific@example.com');
      });

      it('should return empty array if no users found', async function () {
        const result = await usersDao.get();

        expect(result).to.be.an('array');
        expect(result).to.have.lengthOf(0);
      });
    });

    describe('getBy()', function () {
      it('should return a single user by email', async function () {
        await usersDao.create({
          first_name: 'Unique',
          last_name: 'User',
          email: 'unique@example.com',
          age: 25,
          password: 'pass1',
        });

        const result = await usersDao.getBy({ email: 'unique@example.com' });

        expect(result).to.be.an('object');
        expect(result.email).to.equal('unique@example.com');
      });

      it('should return a single user by id', async function () {
        const user = await usersDao.create({
          first_name: 'Test',
          last_name: 'User',
          email: 'test@example.com',
          age: 25,
          password: 'pass1',
        });

        const result = await usersDao.getBy({ _id: user._id });

        expect(result).to.be.an('object');
        expect(result._id.toString()).to.equal(user._id.toString());
      });

      it('should return null if no user found', async function () {
        const result = await usersDao.getBy({
          email: 'nonexistent@example.com',
        });

        expect(result).to.be.null;
      });
    });

    describe('update()', function () {
      it('should update a user successfully', async function () {
        const user = await usersDao.create({
          first_name: 'Original',
          last_name: 'Name',
          email: 'original@example.com',
          age: 25,
          password: 'pass1',
        });

        const result = await usersDao.update(user._id, {
          first_name: 'Updated',
        });

        expect(result).to.be.an('object');
        expect(result.modifiedCount).to.equal(1);

        const updated = await usersDao.getBy({ _id: user._id });
        expect(updated.first_name).to.equal('Updated');
      });

      it('should update user role', async function () {
        const user = await usersDao.create({
          first_name: 'Test',
          last_name: 'User',
          email: 'test@example.com',
          age: 25,
          password: 'pass1',
        });

        await usersDao.update(user._id, { role: 'admin' });

        const updated = await usersDao.getBy({ _id: user._id });
        expect(updated.role).to.equal('admin');
      });

      it('should add pets to user', async function () {
        const user = await usersDao.create({
          first_name: 'Test',
          last_name: 'User',
          email: 'test@example.com',
          age: 25,
          password: 'pass1',
        });

        const petId = new mongoose.Types.ObjectId();
        await usersDao.update(user._id, {
          pets: [{ pet: petId }],
        });

        const updated = await usersDao.getBy({ _id: user._id });
        expect(updated.pets).to.have.lengthOf(1);
        expect(updated.pets[0].pet.toString()).to.equal(petId.toString());
      });

      it('should update user documents', async function () {
        const user = await usersDao.create({
          first_name: 'Test',
          last_name: 'User',
          email: 'test@example.com',
          age: 25,
          password: 'pass1',
        });

        await usersDao.update(user._id, {
          documents: [{ name: 'ID.pdf', reference: '/docs/id.pdf' }],
        });

        const updated = await usersDao.getBy({ _id: user._id });
        expect(updated.documents).to.have.lengthOf(1);
        expect(updated.documents[0].name).to.equal('ID.pdf');
      });

      it('should return modifiedCount 0 if user not found', async function () {
        const result = await usersDao.update(new mongoose.Types.ObjectId(), {
          first_name: 'Updated',
        });

        expect(result.modifiedCount).to.equal(0);
      });
    });

    describe('delete()', function () {
      it('should delete a user successfully', async function () {
        const user = await usersDao.create({
          first_name: 'Delete',
          last_name: 'Me',
          email: 'delete@example.com',
          age: 25,
          password: 'pass1',
        });

        const result = await usersDao.delete(user._id);

        expect(result).to.be.an('object');
        expect(result._id.toString()).to.equal(user._id.toString());

        const deleted = await usersDao.getBy({ _id: user._id });
        expect(deleted).to.be.null;
      });

      it('should return null if user not found', async function () {
        const result = await usersDao.delete(new mongoose.Types.ObjectId());
        expect(result).to.be.null;
      });
    });
  });

  // ========================================
  // Service Layer Tests
  // ========================================

  describe('UsersService', function () {
    describe('getAll()', function () {
      it('should get all users through service', async function () {
        await usersDao.createMany([
          {
            first_name: 'User1',
            last_name: 'Test',
            email: 'user1@example.com',
            age: 25,
            password: 'pass1',
          },
          {
            first_name: 'User2',
            last_name: 'Test',
            email: 'user2@example.com',
            age: 30,
            password: 'pass2',
          },
        ]);

        const result = await usersService.getAll();

        expect(result).to.be.an('array');
        expect(result).to.have.lengthOf(2);
      });

      it('should filter by params through service', async function () {
        await usersDao.createMany([
          {
            first_name: 'Admin',
            last_name: 'Test',
            email: 'admin@example.com',
            age: 30,
            password: 'pass1',
            role: 'admin',
          },
          {
            first_name: 'User',
            last_name: 'Test',
            email: 'user@example.com',
            age: 25,
            password: 'pass2',
          },
        ]);

        const result = await usersService.getAll({ role: 'admin' });

        expect(result).to.be.an('array');
        expect(result).to.have.lengthOf(1);
      });
    });

    describe('getById()', function () {
      it('should get user by id through service', async function () {
        const user = await usersDao.create({
          first_name: 'Test',
          last_name: 'User',
          email: 'test@example.com',
          age: 25,
          password: 'pass1',
        });

        const result = await usersService.getById(user._id);

        expect(result).to.be.an('object');
        expect(result._id.toString()).to.equal(user._id.toString());
      });

      it('should return null if user not found', async function () {
        const result = await usersService.getById(
          new mongoose.Types.ObjectId()
        );

        expect(result).to.be.null;
      });
    });

    describe('create()', function () {
      it('should create user through service', async function () {
        const userData = {
          first_name: 'Service',
          last_name: 'User',
          email: 'service@example.com',
          age: 28,
          password: 'pass1',
        };

        const result = await usersService.create(userData);

        expect(result).to.be.an('object');
        expect(result).to.have.property('_id');
        expect(result.first_name).to.equal(userData.first_name);
      });
    });

    describe('update()', function () {
      it('should update user through service', async function () {
        const user = await usersDao.create({
          first_name: 'Original',
          last_name: 'User',
          email: 'original@example.com',
          age: 25,
          password: 'pass1',
        });

        const result = await usersService.update(user._id, {
          first_name: 'Updated',
        });

        expect(result).to.be.an('object');
        expect(result.modifiedCount).to.equal(1);
      });
    });

    describe('delete()', function () {
      it('should delete user through service', async function () {
        const user = await usersDao.create({
          first_name: 'Delete',
          last_name: 'User',
          email: 'delete@example.com',
          age: 25,
          password: 'pass1',
        });

        const result = await usersService.delete(user._id);

        expect(result).to.be.an('object');
        expect(result._id.toString()).to.equal(user._id.toString());
      });
    });
  });

  // ========================================
  // Controller Layer Tests
  // ========================================

  describe('UsersController', function () {
    let req, res;

    beforeEach(function () {
      // Mock request and response objects
      req = {
        params: {},
        query: {},
        body: {},
        files: [],
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
      it('should return all users with success response', async function () {
        await usersDao.createMany([
          {
            first_name: 'User1',
            last_name: 'Test',
            email: 'user1@example.com',
            age: 25,
            password: 'pass1',
          },
          {
            first_name: 'User2',
            last_name: 'Test',
            email: 'user2@example.com',
            age: 30,
            password: 'pass2',
          },
        ]);

        await usersController.getAll(req, res);

        expect(res.statusCode).to.equal(200);
        expect(res.data).to.have.property('success', true);
        expect(res.data).to.have.property('payload');
        expect(res.data.payload).to.be.an('array');
        expect(res.data.payload).to.have.lengthOf(2);
      });

      it('should handle query params for filtering', async function () {
        await usersDao.createMany([
          {
            first_name: 'Admin',
            last_name: 'Test',
            email: 'admin@example.com',
            age: 30,
            password: 'pass1',
            role: 'admin',
          },
          {
            first_name: 'User',
            last_name: 'Test',
            email: 'user@example.com',
            age: 25,
            password: 'pass2',
          },
        ]);

        req.query = { role: 'admin' };
        await usersController.getAll(req, res);

        expect(res.statusCode).to.equal(200);
        expect(res.data.success).to.be.true;
        expect(res.data.payload).to.have.lengthOf(1);
      });

      it('should handle errors gracefully', async function () {
        const originalGetAll = usersService.getAll;
        usersService.getAll = async () => {
          throw new Error('Database error');
        };

        await usersController.getAll(req, res);

        expect(res.statusCode).to.equal(500);
        expect(res.data).to.have.property('success', false);
        expect(res.data).to.have.property('error');

        usersService.getAll = originalGetAll;
      });
    });

    describe('get()', function () {
      it('should return user by id with success response', async function () {
        const user = await usersDao.create({
          first_name: 'Test',
          last_name: 'User',
          email: 'test@example.com',
          age: 25,
          password: 'pass1',
        });

        req.params = { uid: user._id.toString() };
        await usersController.get(req, res);

        expect(res.statusCode).to.equal(200);
        expect(res.data).to.have.property('success', true);
        expect(res.data).to.have.property('payload');
        expect(res.data.payload._id.toString()).to.equal(user._id.toString());
      });

      it('should return error if uid is missing', async function () {
        req.params = {};
        await usersController.get(req, res);

        expect(res.statusCode).to.equal(400);
        expect(res.data).to.have.property('success', false);
        expect(res.data.error).to.equal('Falta el ID del usuario');
      });

      it('should handle errors gracefully', async function () {
        req.params = { uid: 'invalid-id' };
        await usersController.get(req, res);

        expect(res.statusCode).to.equal(500);
        expect(res.data).to.have.property('success', false);
      });
    });

    describe('create()', function () {
      it('should create user with success response', async function () {
        req.body = {
          first_name: 'New',
          last_name: 'User',
          email: 'new@example.com',
          age: 28,
          password: 'pass1',
        };

        await usersController.create(req, res);

        expect(res.statusCode).to.equal(201);
        expect(res.data).to.have.property('success', true);
        expect(res.data).to.have.property('payload');
        expect(res.data.payload).to.have.property('_id');
        expect(res.data.payload.first_name).to.equal('New');
      });

      it('should handle errors gracefully', async function () {
        req.body = {}; // Missing required fields

        await usersController.create(req, res);

        expect(res.statusCode).to.equal(500);
        expect(res.data).to.have.property('success', false);
      });
    });

    describe('update()', function () {
      it('should update user with success response', async function () {
        const user = await usersDao.create({
          first_name: 'Original',
          last_name: 'User',
          email: 'original@example.com',
          age: 25,
          password: 'pass1',
        });

        req.params = { uid: user._id.toString() };
        req.body = { first_name: 'Updated' };

        await usersController.update(req, res);

        expect(res.statusCode).to.equal(200);
        expect(res.data).to.have.property('success', true);
        expect(res.data).to.have.property('payload');
      });

      it('should return error if uid is missing', async function () {
        req.params = {};
        req.body = { first_name: 'Updated' };

        await usersController.update(req, res);

        expect(res.statusCode).to.equal(400);
        expect(res.data).to.have.property('success', false);
        expect(res.data.error).to.equal('Falta el ID del usuario');
      });

      it('should handle errors gracefully', async function () {
        req.params = { uid: 'invalid-id' };
        req.body = { first_name: 'Updated' };

        await usersController.update(req, res);

        expect(res.statusCode).to.equal(500);
        expect(res.data).to.have.property('success', false);
      });
    });

    describe('updateDocuments()', function () {
      it('should update user documents successfully', async function () {
        const user = await usersDao.create({
          first_name: 'Test',
          last_name: 'User',
          email: 'test@example.com',
          age: 25,
          password: 'pass1',
        });

        req.params = { uid: user._id.toString() };
        req.files = [
          { originalname: 'id.pdf', filename: 'id-123.pdf' },
          { originalname: 'proof.pdf', filename: 'proof-456.pdf' },
        ];

        await usersController.updateDocuments(req, res);

        expect(res.statusCode).to.equal(200);
        expect(res.data).to.have.property('success', true);
        expect(res.data).to.have.property('payload');
      });

      it('should return error if uid is missing', async function () {
        req.params = {};
        req.files = [{ originalname: 'test.pdf', filename: 'test-123.pdf' }];

        await usersController.updateDocuments(req, res);

        expect(res.statusCode).to.equal(400);
        expect(res.data).to.have.property('success', false);
        expect(res.data.error).to.equal('Falta el ID del usuario');
      });

      it('should handle multiple document uploads', async function () {
        const user = await usersDao.create({
          first_name: 'Test',
          last_name: 'User',
          email: 'test@example.com',
          age: 25,
          password: 'pass1',
        });

        req.params = { uid: user._id.toString() };
        req.files = [
          { originalname: 'doc1.pdf', filename: 'doc1-123.pdf' },
          { originalname: 'doc2.pdf', filename: 'doc2-456.pdf' },
          { originalname: 'doc3.pdf', filename: 'doc3-789.pdf' },
        ];

        await usersController.updateDocuments(req, res);

        expect(res.statusCode).to.equal(200);
        expect(res.data.success).to.be.true;

        const updated = await usersDao.getBy({ _id: user._id });
        expect(updated.documents).to.have.lengthOf(3);
      });

      it('should handle errors gracefully', async function () {
        req.params = { uid: 'invalid-id' };
        req.files = [{ originalname: 'test.pdf', filename: 'test-123.pdf' }];

        await usersController.updateDocuments(req, res);

        expect(res.statusCode).to.equal(500);
        expect(res.data).to.have.property('success', false);
      });
    });

    describe('delete()', function () {
      it('should delete user with success response', async function () {
        const user = await usersDao.create({
          first_name: 'Delete',
          last_name: 'User',
          email: 'delete@example.com',
          age: 25,
          password: 'pass1',
        });

        req.params = { uid: user._id.toString() };

        await usersController.delete(req, res);

        expect(res.statusCode).to.equal(200);
        expect(res.data).to.have.property('success', true);
        expect(res.data).to.have.property('payload');
      });

      it('should return error if uid is missing', async function () {
        req.params = {};

        await usersController.delete(req, res);

        expect(res.statusCode).to.equal(400);
        expect(res.data).to.have.property('success', false);
        expect(res.data.error).to.equal('Falta el ID del usuario');
      });

      it('should handle errors gracefully', async function () {
        req.params = { uid: 'invalid-id' };

        await usersController.delete(req, res);

        expect(res.statusCode).to.equal(500);
        expect(res.data).to.have.property('success', false);
      });
    });
  });

  // ========================================
  // Integration Tests
  // ========================================

  describe('Integration Tests', function () {
    it('should complete full CRUD cycle', async function () {
      // Create
      const created = await usersService.create({
        first_name: 'Integration',
        last_name: 'Test',
        email: 'integration@example.com',
        age: 30,
        password: 'hashedPassword',
      });
      expect(created).to.have.property('_id');
      expect(created.role).to.equal('user');

      // Read
      const found = await usersService.getById(created._id);
      expect(found).to.not.be.null;
      expect(found._id.toString()).to.equal(created._id.toString());

      // Update
      await usersService.update(created._id, { first_name: 'Updated Name' });
      const updated = await usersService.getById(created._id);
      expect(updated.first_name).to.equal('Updated Name');

      // Delete
      await usersService.delete(created._id);
      const deleted = await usersService.getById(created._id);
      expect(deleted).to.be.null;
    });

    it('should handle user with pets workflow', async function () {
      // Create user
      const user = await usersService.create({
        first_name: 'Pet',
        last_name: 'Owner',
        email: 'petowner@example.com',
        age: 28,
        password: 'pass1',
      });

      expect(user.pets).to.be.an('array').that.is.empty;

      // Add pets
      const petId1 = new mongoose.Types.ObjectId();
      const petId2 = new mongoose.Types.ObjectId();

      await usersService.update(user._id, {
        pets: [{ pet: petId1 }, { pet: petId2 }],
      });

      // Verify pets added
      const updated = await usersService.getById(user._id);
      expect(updated.pets).to.have.lengthOf(2);
      expect(updated.pets[0].pet.toString()).to.equal(petId1.toString());
      expect(updated.pets[1].pet.toString()).to.equal(petId2.toString());
    });

    it('should handle user documents workflow', async function () {
      // Create user
      const user = await usersService.create({
        first_name: 'Doc',
        last_name: 'User',
        email: 'docuser@example.com',
        age: 35,
        password: 'pass1',
      });

      expect(user.documents).to.be.an('array').that.is.empty;

      // Add documents
      await usersService.update(user._id, {
        documents: [
          { name: 'ID.pdf', reference: '/public/documents/id.pdf' },
          { name: 'Proof.pdf', reference: '/public/documents/proof.pdf' },
        ],
      });

      // Verify documents added
      const updated = await usersService.getById(user._id);
      expect(updated.documents).to.have.lengthOf(2);
      expect(updated.documents[0].name).to.equal('ID.pdf');
      expect(updated.documents[1].name).to.equal('Proof.pdf');
    });

    it('should handle role upgrade workflow', async function () {
      // Create regular user
      const user = await usersService.create({
        first_name: 'Regular',
        last_name: 'User',
        email: 'regular@example.com',
        age: 25,
        password: 'pass1',
      });

      expect(user.role).to.equal('user');

      // Upgrade to admin
      await usersService.update(user._id, { role: 'admin' });

      const upgraded = await usersService.getById(user._id);
      expect(upgraded.role).to.equal('admin');
    });

    it('should filter users by role', async function () {
      await usersService.create({
        first_name: 'Admin1',
        last_name: 'Test',
        email: 'admin1@example.com',
        age: 30,
        password: 'pass1',
        role: 'admin',
      });

      await usersService.create({
        first_name: 'User1',
        last_name: 'Test',
        email: 'user1@example.com',
        age: 25,
        password: 'pass2',
      });

      await usersService.create({
        first_name: 'Admin2',
        last_name: 'Test',
        email: 'admin2@example.com',
        age: 35,
        password: 'pass3',
        role: 'admin',
      });

      const admins = await usersService.getAll({ role: 'admin' });
      expect(admins).to.have.lengthOf(2);

      const users = await usersService.getAll({ role: 'user' });
      expect(users).to.have.lengthOf(1);
    });

    it('should enforce unique email constraint', async function () {
      const userData = {
        first_name: 'Test',
        last_name: 'User',
        email: 'unique@example.com',
        age: 25,
        password: 'pass1',
      };

      await usersService.create(userData);

      try {
        await usersService.create(userData);
        expect.fail('Should have thrown an error');
      } catch (error) {
        expect(error).to.exist;
      }
    });
  });

  // ========================================
  // Edge Cases and Validation Tests
  // ========================================

  describe('Edge Cases', function () {
    it('should handle very long names', async function () {
      const longName = 'A'.repeat(100);
      const user = await usersService.create({
        first_name: longName,
        last_name: longName,
        email: 'longname@example.com',
        age: 25,
        password: 'pass1',
      });

      expect(user.first_name).to.equal(longName);
      expect(user.last_name).to.equal(longName);
    });

    it('should handle special characters in names', async function () {
      const specialName = "O'Brien-José";
      const user = await usersService.create({
        first_name: specialName,
        last_name: specialName,
        email: 'special@example.com',
        age: 25,
        password: 'pass1',
      });

      expect(user.first_name).to.equal(specialName);
    });

    it('should handle various email formats', async function () {
      const emails = [
        'simple@example.com',
        'user.name@example.com',
        'user+tag@example.co.uk',
        'user_name@sub.example.com',
      ];

      for (let i = 0; i < emails.length; i++) {
        const user = await usersService.create({
          first_name: 'Test',
          last_name: 'User',
          email: emails[i],
          age: 25,
          password: 'pass1',
        });

        expect(user.email).to.equal(emails[i]);
      }
    });

    it('should handle minimum age', async function () {
      const user = await usersService.create({
        first_name: 'Young',
        last_name: 'User',
        email: 'young@example.com',
        age: 1,
        password: 'pass1',
      });

      expect(user.age).to.equal(1);
    });

    it('should handle very old age', async function () {
      const user = await usersService.create({
        first_name: 'Old',
        last_name: 'User',
        email: 'old@example.com',
        age: 150,
        password: 'pass1',
      });

      expect(user.age).to.equal(150);
    });

    it('should handle multiple document updates', async function () {
      const user = await usersService.create({
        first_name: 'Test',
        last_name: 'User',
        email: 'test@example.com',
        age: 25,
        password: 'pass1',
      });

      // First update
      await usersService.update(user._id, {
        documents: [{ name: 'Doc1.pdf', reference: '/docs/doc1.pdf' }],
      });

      // Second update (replace documents)
      await usersService.update(user._id, {
        documents: [
          { name: 'Doc2.pdf', reference: '/docs/doc2.pdf' },
          { name: 'Doc3.pdf', reference: '/docs/doc3.pdf' },
        ],
      });

      const updated = await usersService.getById(user._id);
      expect(updated.documents).to.have.lengthOf(2);
    });

    it('should handle empty pets and documents arrays', async function () {
      const user = await usersService.create({
        first_name: 'Test',
        last_name: 'User',
        email: 'test@example.com',
        age: 25,
        password: 'pass1',
        pets: [],
        documents: [],
      });

      expect(user.pets).to.be.an('array').that.is.empty;
      expect(user.documents).to.be.an('array').that.is.empty;
    });
  });
});
