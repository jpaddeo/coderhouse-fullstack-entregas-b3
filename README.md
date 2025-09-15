# Entrega 1 - Backend III: Testing y Escalabilidad Backend

[CONSIGNA](CONSIGNA.md)

## Configuración

1. Instalar dependencias:

```bash
npm install
```

2. Configurar variables de entorno (crear `.env` basado en `.env.example`)

3. Iniciar el servidor:

```bash
# modo desarrollo
npm run dev

# modo ejecucion
npm run start
```

## Endpoints

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

### USERS

#### 1. **obtener mascotas**

- **Endpoint**: `GET /api/users`
- **Respuesta**: datos de usuarios en la bd

#### 2. **obtener mascota por uid**

- **Endpoint**: `GET /api/users/:uid`
- **Params**: `uid` (obligatorio)
- **Respuesta**: datos de usuario específica en la bd
