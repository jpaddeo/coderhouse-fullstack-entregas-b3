import GenericRepository from './generic.repository.js';

export default class PetsRepository extends GenericRepository {
  constructor(dao) {
    super(dao);
  }
}
