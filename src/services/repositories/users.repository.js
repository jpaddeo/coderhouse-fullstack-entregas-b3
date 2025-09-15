import bcrypt from 'bcrypt';

import GenericRepository from './generic.repository.js';

export default class UsersRepository extends GenericRepository {
  constructor(dao) {
    super(dao);
  }

  hashPassword(password) {
    return bcrypt.hashSync(password, 10);
  }
}
