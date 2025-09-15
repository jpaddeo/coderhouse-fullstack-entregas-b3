import { userModel } from './models/user.model.js';

export default class UsersDao {
  get(params = {}) {
    return userModel.find(params);
  }

  getBy(params) {
    return userModel.findOne(params);
  }

  create(doc) {
    return userModel.create(doc);
  }

  createMany(docs) {
    return userModel.insertMany(docs);
  }

  update(id, data) {
    return userModel.updateOne({ _id: id }, data);
  }

  delete(id) {
    return userModel.findByIdAndDelete(id);
  }
}
