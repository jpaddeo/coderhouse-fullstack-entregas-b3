import { petModel } from './models/pet.model.js';

export default class PetsDao {
  get(params = {}) {
    return petModel.find(params);
  }

  getBy(params) {
    return petModel.findOne(params);
  }

  create(doc) {
    return petModel.create(doc);
  }

  createMany(docs) {
    return petModel.insertMany(docs);
  }

  update(id, data) {
    return petModel.updateOne({ _id: id }, data);
  }

  delete(id) {
    return petModel.findByIdAndDelete(id);
  }
}
