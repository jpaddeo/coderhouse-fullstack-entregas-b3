import AdoptionsDao from '../dao/adoptions.dao.js';

import AdoptionsRepository from './repositories/adoptions.repository.js';

export const adoptionsService = new AdoptionsRepository(new AdoptionsDao());
