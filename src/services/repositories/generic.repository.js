export default class GenericRepository {
  constructor(dao) {
    this.dao = dao;
  }

  getAll(params) {
    return this.dao.get(params);
  }

  getBy(params) {
    return this.dao.getBy(params);
  }

  getById(id) {
    return this.dao.getBy({ _id: id });
  }

  create(doc) {
    return this.dao.create(doc);
  }

  createMany(docs) {
    return this.dao.createMany(docs);
  }

  update(id, doc) {
    return this.dao.update(id, doc);
  }

  delete(id) {
    return this.dao.delete(id);
  }
}
