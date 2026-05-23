# Pruebas Locales - Paso a Paso

## Opción 1: MongoDB Local (sin Atlas)

1. Instalar MongoDB localmente:

```bash
# Ubuntu/Debian
sudo apt-get install mongodb

# macOS
brew install mongodb-community

# Windows
# Descargar desde mongodb.com
```

2. Iniciar MongoDB:

```bash
# Ubuntu/Debian/macOS
sudo systemctl start mongodb
# o
mongod

# Windows
# Ejecutar MongoDB Compass o mongod.exe
```

3. Configurar .env:

```env
MONGODB_URI=mongodb://localhost:27017/recipe-app
```

## Opción 2: MongoDB Atlas (Cloud - Gratis)

1. Crear cuenta en https://www.mongodb.com/cloud/atlas
2. Crear cluster gratuito (M0)
3. Crear usuario de base de datos
4. Whitelist IP (0.0.0.0/0 para desarrollo)
5. Obtener connection string
6. Configurar .env con el URI de Atlas

## Instalar dependencias

```bash
npm install
```

## Ejecutar servidor

```bash
npm run dev
```

## Probar endpoints con Postman o curl

### Health Check

```bash
curl http://localhost:5000/health
```

### Registro

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "password123"
  }'
```

### Login

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

## Verificar en MongoDB

```bash
# Conectar a MongoDB local
mongosh

# O con URI completo
mongosh "mongodb://localhost:27017/recipe-app"

# Ver usuarios
use recipe-app
db.users.find().pretty()
```
