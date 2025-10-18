# Entrega FINAL - Backend III: Testing y Escalabilidad Backend

[CONSIGNA](CONSIGNA.md)

## Compilación y ejecución

### Ambiente Docker

#### Imagen en Docker Hub

[link a la imagen](https://hub.docker.com/layers/jpaddeo/coderhouse/b3-entrega-final/images/sha256-93d6f1d8b8c8164d86b8d905b4a8ec44720c25899cced029499a345bb3411fb2)

#### Ejecución de proyecto usando imagen de docker

```bash
docker run -p 5000:5000 -e BASE_URL=http://localhost:5000 -e MONGODB_URI="<poner uri de mongo>" jpaddeo/coderhouse:b3-entrega-final
```

**NOTA:** Si deseamos que corra en modo daemon entonces agregar opción `-d` al comando anterior:

```bash
docker run -d -p 5000:5000 -e BASE_URL=http://localhost:5000 -e MONGODB_URI="<poner uri de mongo>" jpaddeo/coderhouse:b3-entrega-final
```

#### Generación de imagen local y publicación

```bash
docker build -t jpaddeo/coderhouse:b3-entrega-final .
docker tag jpaddeo/coderhouse:b3-entrega-final jpaddeo/coderhouse:b3-entrega-final
docker push jpaddeo/coderhouse:b3-entrega-final
```

### Ambiente Local

1. Instalar dependencias:

```bash
npm install
```

2. Configurar variables de entorno (crear `.env` basado en `.env.example` y cambiar valores según ambiente)

3. Iniciar el servidor:

```bash
# modo desarrollo
npm run dev

# modo ejecucion
npm run start
```

## Link en Railway (deploy)

En el siguiente [link](https://coderhouse-fullstack-entregas-b3-production.up.railway.app/api/docs) se encuentra la solución implementada.

## Endpoints

> Se recomienda ver documentación en en la ruta `/api/docs`.

### MOCKS

#### 1. **(MOCK) mockingpets**

- **Endpoint**: `GET /api/mocks/mockingpets{/:quantity}`
- **Params**: `quantity` (opcional)
- **Respuesta**: datos mockeados de mascotas

#### 2. **(MOCK) mockingusers**

- **Endpoint**: `GET /api/mocks/mockingusers{/:quantity}`
- **Params**: `quantity` (opcional)
- **Respuesta**: datos mockeados de usuarios

#### 2. **(MOCK) generateData / generate-data**

- **Endpoint**: `POST /api/mocks/generateData` | `POST /api/mocks/generate-data`
- **Body**:

```json
    {
        "users": int,
        "pets": int
    }
```

- **Respuesta**: datos mockeados de usuarios

### PETS

#### 1. **obtener mascotas**

- **Endpoint**: `GET /api/pets`
- **Respuesta**: datos de pets en la bd

#### 2. **obtener mascota por uid**

- **Endpoint**: `GET /api/pets/:uid`
- **Params**: `uid` (obligatorio)
- **Respuesta**: datos de pet específica en la bd

#### 3. **crear mascota**

- **Endpoint**: `POST /api/pets`
- **Body**: datos de la mascota a crear
- **Respuesta**: mascota creada

#### 4. **crear mascota con imagen**

- **Endpoint**: `POST /api/pets/withimage`
- **Body**: datos de la mascota a crear + archivo de foto
- **Respuesta**: mascota creada


#### 5. **actualizar mascota**

- **Endpoint**: `PUT /api/pets/:uid`
- **Params**: `uid` (obligatorio)
- **Body**: datos de la mascota a actualizar
- **Respuesta**: mascota actualizada

#### 6. **eliminar mascota**

- **Endpoint**: `DELETE /api/pets/:uid`
- **Params**: `uid` (obligatorio)
- **Respuesta**: confirmación de eliminación

### USERS

#### 1. **obtener usuarios**

- **Endpoint**: `GET /api/users`
- **Respuesta**: datos de usuarios en la bd

#### 2. **obtener usuario por uid**

- **Endpoint**: `GET /api/users/:uid`
- **Params**: `uid` (obligatorio)
- **Respuesta**: datos de usuario específica en la bd

#### 3. **crear usuario**

- **Endpoint**: `POST /api/users`
- **Body**: datos del usuario a crear
- **Respuesta**: usuario creada

#### 4. **adjuntar documentos a usuario**

- **Endpoint**: `POST /api/users/:uid/documents`
- **Body**: docuemntos a subir para el usuario
- **Respuesta**: resultado de actualización

#### 4. **actualizar usuario**

- **Endpoint**: `PUT /api/users/:uid`
- **Params**: `uid` (obligatorio)
- **Body**: datos del usuario a actualizar
- **Respuesta**: usuario actualizada

#### 5. **eliminar usuario**

- **Endpoint**: `DELETE /api/users/:uid`
- **Params**: `uid` (obligatorio)
- **Respuesta**: confirmación de eliminación