import UsersDao from '../dao/users.dao.js';

import UsersRepository from './repositories/users.repository.js';

export const usersService = new UsersRepository(new UsersDao());
