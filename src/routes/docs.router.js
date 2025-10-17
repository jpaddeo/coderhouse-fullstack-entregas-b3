import { Router } from 'express';
import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';
import path from 'path';
import { fileURLToPath } from 'url';

import { logger } from '../utils/logger.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API Coderhouse: Backend III - Entrega Final',
      version: '1.0.0',
      description:
        'Documentación de API de la entrega final del curso Backend III de Coderhouse',
      contact: {
        name: 'Coderhouse',
        email: 'info@coderhouse.com',
      },
    },
    servers: [
      {
        url: 'http://localhost:5000',
        description: 'Servidor de desarrollo',
      },
    ],
    tags: [
      {
        name: 'General',
        description: 'Endpoints generales de la API',
      },
      {
        name: 'Pets',
        description: 'Operaciones relacionadas con mascotas',
      },
      {
        name: 'Users',
        description: 'Operaciones relacionadas con usuarios',
      },
      {
        name: 'Adoptions',
        description: 'Operaciones relacionadas con adopciones',
      },
    ],
  },
  apis: [path.join(__dirname, '../docs/*.yml')],
};

let swaggerSpec;
try {
  logger.info('✅ Swagger spec generado correctamente');
  swaggerSpec = swaggerJsdoc(options);
} catch (error) {
  logger.error('❌ Error generando swagger spec:', error);
  swaggerSpec = {
    openapi: '3.0.0',
    info: {
      title: 'API Coderhouse: Backend III - Entrega Final',
      version: '1.0.0',
      description: 'Error al cargar la documentación',
    },
    paths: {},
  };
}

const router = Router();

router.get('/spec', (_, res) => {
  res.json(swaggerSpec);
});
router.use('/', swaggerUi.serve);
router.get(
  '/',
  swaggerUi.setup(swaggerSpec, {
    explorer: true,
    customCss: '.swagger-ui .topbar { display: none }',
    customSiteTitle: 'API Coderhouse - Backend III',
    swaggerOptions: {
      persistAuthorization: true,
    },
  })
);

export default router;
