import { adoptionModel } from './models/adoption.model.js';

export default class AdoptionsDao {
  get(params = {}) {
    return adoptionModel.find(params);
  }

  getBy(params) {
    return adoptionModel.findOne(params);
  }

  create(doc) {
    return adoptionModel.create(doc);
  }

  createMany(docs) {
    return adoptionModel.insertMany(docs);
  }

  update(id, data) {
    return adoptionModel.updateOne({ _id: id }, data);
  }

  delete(id) {
    return adoptionModel.findByIdAndDelete(id);
  }
}
