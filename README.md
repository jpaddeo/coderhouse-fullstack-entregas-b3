# Entrega FINAL - Backend III: Testing y Escalabilidad Backend

[CONSIGNA](CONSIGNA.md)

## Instalación

### Docker

#### Imagen en Docker Hub

[link a la imagen](https://hub.docker.com/layers/jpaddeo/coderhouse/b3-entrega-final/images/sha256-668e425bdd2868dfe9f4abfd94e03774eb177abf23c9b321ea7bf43e39b7faeb)

#### Compilación y publicación

```bash
docker build -t jpaddeo/coderhouse:b3-entrega-final .
docker tag jpaddeo/coderhouse:b3-entrega-final jpaddeo/coderhouse:b3-entrega-final
docker push jpaddeo/coderhouse:b3-entrega-final
```

### Local

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

## Endpoints

Se recomienda ver documentación en en la ruta `/api/docs`.

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