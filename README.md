<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

### METRICAS DE TICKETS

```json
{
  "total": 7,
  "porEstado": {
    "ABIERTO": 4,
    "EN_PROCESO": 3,
    "RESUELTO": 0,
    "CERRADO": 0
  },
  "porCategoria": [
    { "id": 1, "nombre": "Hardware", "total": 5 },
    { "id": 2, "nombre": "Software", "total": 2 },
    { "id": 3, "nombre": "Redes", "total": 0 }
  ]
}
```

### DESCRIPCION DE LOS CAMPOS
| `Total` - La cantidad total de los ticket que existen |
| `porEstado` - Estado operativo de como se encuentra el ticket, si se encuentra ABIERTO, EN_PROCESO, RESULETO, CERRADO. |
| `porCategoria` - Filtro para organizar la cantidad de ticket por sus categorias. Se encuentra la ID de la categoria, el nombre de la categoria, y el total de tickets que hay en la categoria |

### Ejemplo de uso
|`http://localhost:3000/tickets/metricas` autorización de token de un usuario ADMIN o AGENTE e ingresar por medio de metricas |


  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg" alt="Donate us"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow" alt="Follow us on Twitter"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

# Help Desk Interno

Backend para la gestión interna de incidencias y requerimientos técnicos.

El sistema permite registrar usuarios, autenticarse mediante JWT, gestionar tickets, categorías y comentarios, asignar incidencias a agentes, consultar métricas y restringir acciones según el rol del usuario.

## Tecnologías utilizadas

- Node.js
- NestJS
- TypeScript
- PostgreSQL
- Prisma ORM
- JWT
- bcryptjs
- Swagger
- class-validator
- Joi
- Vitest

## Requisitos previos

Antes de instalar el proyecto se debe contar con:

- Node.js
- npm
- PostgreSQL
- Git

## Instalación desde cero

### 1. Clonar el repositorio

```bash
git clone https://github.com/urrestipaolo/grupo5_helpdeskinterno.git
```

Ingresar al proyecto:

```bash
cd grupo5_helpdeskinterno
```

### 2. Instalar dependencias

```bash
npm install
```

Las advertencias de paquetes obsoletos o vulnerabilidades de dependencias no necesariamente impiden ejecutar el proyecto. Si la instalación termina correctamente, se puede continuar.

### 3. Configurar variables de entorno

El proyecto incluye un archivo `.env.example`.

Crear una copia llamada `.env`.

En Windows PowerShell:

```powershell
Copy-Item .env.example .env
```

En Linux o macOS:

```bash
cp .env.example .env
```

Luego editar `.env` con los datos locales.

Ejemplo:

```env
NODE_ENV="development"
PORT=3000
DATABASE_URL="postgresql://postgres:password@localhost:5432/helpdesk?schema=public"
JWT_SECRET="cambia_esta_clave_por_una_de_al_menos_32_caracteres"
JWT_EXPIRES_IN="8h"
```

> No se debe subir el archivo `.env` al repositorio.

### 4. Configurar PostgreSQL

Asegurarse de que PostgreSQL se encuentre iniciado y que las credenciales configuradas en `DATABASE_URL` sean válidas.

Ejemplo:

```env
DATABASE_URL="postgresql://postgres:TU_PASSWORD@localhost:5432/helpdesk?schema=public"
```

El usuario configurado debe tener permisos para crear y modificar la base de datos utilizada por el proyecto.

### 5. Generar Prisma Client

```bash
npx prisma generate
```

Salida esperada:

```text
Generated Prisma Client
```

### 6. Aplicar las migraciones

```bash
npx prisma migrate dev
```

Este comando crea o actualiza las tablas necesarias según el esquema Prisma.

### 7. Cargar datos de prueba

Ejecutar:

```bash
npx tsx prisma/seed.ts
```

El seed crea los siguientes usuarios:

| Rol      | Email                  | Contraseña  |
| -------- | ---------------------- | ----------- |
| ADMIN    | admin@helpdesk.com     | Password123 |
| AGENTE   | agente@helpdesk.com    | Password123 |
| EMPLEADO | empleado@helpdesk.com  | Password123 |
| EMPLEADO | empleado2@helpdesk.com | Password123 |

## Verificación del proyecto

### 8. Compilar

```bash
npm run build
```

El proyecto debe compilar sin errores.

### 9. Ejecutar las pruebas

```bash
npm test
```

También se puede ejecutar una prueba específica:

```bash
npm test -- usuarios.service.spec.ts
```

### 10. Levantar el servidor

```bash
npm run start:dev
```

Por defecto la API se ejecuta en:

```text
http://localhost:3000
```

## Swagger

La documentación interactiva está disponible en:

```text
http://localhost:3000/api
```

Desde Swagger se pueden consultar y probar los endpoints disponibles.

Para probar endpoints protegidos:

1. Ejecutar `POST /auth/login`.
2. Copiar el token JWT recibido.
3. Presionar `Authorize` en Swagger.
4. Introducir el token.
5. Ejecutar los endpoints protegidos.

## Roles del sistema

El sistema utiliza tres roles:

- `ADMIN`: administración general del sistema.
- `AGENTE`: gestión y atención de incidencias.
- `EMPLEADO`: creación y seguimiento de sus propias incidencias.

El registro público crea usuarios únicamente con rol:

```text
EMPLEADO
```

Los roles `ADMIN` y `AGENTE` deben ser asignados mediante funciones administrativas.

## Usuarios

El módulo de usuarios permite:

- crear usuarios;
- listar usuarios;
- consultar un usuario;
- filtrar por rol;
- paginar resultados;
- actualizar usuarios;
- desactivar usuarios mediante baja lógica;
- reactivar usuarios;
- proteger acciones según JWT y rol.

Ejemplo de paginación:

```text
GET /usuarios?page=1&limit=10
```

Ejemplo de filtro por rol:

```text
GET /usuarios?rol=AGENTE&page=1&limit=5
```

Solo `ADMIN` y `AGENTE` pueden consultar el listado de usuarios.

Las operaciones administrativas de creación, modificación, baja y reactivación requieren rol `ADMIN`.

Las contraseñas nunca se devuelven en las respuestas públicas de usuarios.

## Tickets

Los tickets utilizan los siguientes estados:

- `ABIERTO`
- `EN_PROCESO`
- `RESUELTO`
- `CERRADO`

Prioridades disponibles:

- `BAJA`
- `MEDIA`
- `ALTA`

El flujo general de atención es:

```text
ABIERTO
   ↓
EN_PROCESO
   ↓
RESUELTO
   ↓
CERRADO
```

Los tickets pueden ser asignados a agentes para su atención.

## Comentarios

Los tickets permiten registrar comentarios asociados a:

- un ticket;
- un autor;
- una fecha de creación.

Los comentarios utilizan el usuario autenticado mediante JWT como autor.

## Manejo global de errores

La API utiliza un formato consistente para las respuestas de error.

Ejemplo:

```json
{
  "success": false,
  "statusCode": 404,
  "message": "Registro no encontrado",
  "error": "Not Found",
  "path": "/recurso",
  "timestamp": "2026-10-08T00:00:00.000Z"
}
```

Los errores no exponen:

- stack traces;
- consultas SQL;
- detalles internos de Prisma;
- contraseñas;
- información sensible de la base de datos.

Las respuestas exitosas también utilizan una estructura uniforme:

```json
{
  "success": true,
  "data": {},
  "timestamp": "2026-10-08T00:00:00.000Z"
}
```

## Decisiones de negocio

El equipo definió las siguientes reglas generales:

- cada usuario tiene un único rol directo;
- el registro público siempre crea usuarios `EMPLEADO`;
- solo funciones administrativas pueden asignar roles internos;
- la eliminación de usuarios utiliza baja lógica;
- los usuarios inactivos se conservan para mantener el historial;
- los usuarios inactivos no deben utilizarse para nuevas asignaciones;
- los empleados consultan únicamente los tickets que les corresponden;
- los agentes gestionan incidencias;
- los administradores tienen acceso a funciones administrativas.

## Notificaciones

Las historias US-18, US-19 y US-20 implementan el mecanismo de notificaciones del Help Desk.

Esta sección debe actualizarse con la solución final elegida por el equipo una vez que dichas historias sean integradas en `master`.

## Comandos útiles

Compilar:

```bash
npm run build
```

Ejecutar en desarrollo:

```bash
npm run start:dev
```

Ejecutar todas las pruebas:

```bash
npm test
```

Ejecutar cobertura:

```bash
npm run test:cov
```

Ejecutar pruebas E2E:

```bash
npm run test:e2e
```

Generar Prisma Client:

```bash
npx prisma generate
```

Ejecutar migraciones:

```bash
npx prisma migrate dev
```

Cargar datos de prueba:

```bash
npx tsx prisma/seed.ts
```

## Flujo Git del equipo

El equipo trabaja mediante ramas por funcionalidad.

Flujo general:

```text
feature/*
   ↓
Pull Request
   ↓
Revisión del equipo
   ↓
Merge por Scrum Master
   ↓
master
```

Los integrantes desarrollan sus historias en ramas separadas y crean un Pull Request al terminar.

Los merges a `master` son realizados por el Scrum Master después de la revisión correspondiente.

## Prueba de instalación

Para validar esta guía se recomienda probar el proyecto desde una carpeta o equipo nuevo siguiendo únicamente este README:

```text
Clonar
  ↓
npm install
  ↓
crear .env
  ↓
prisma generate
  ↓
prisma migrate dev
  ↓
seed
  ↓
build
  ↓
tests
  ↓
start:dev
  ↓
Swagger
```

Si el proyecto puede levantarse siguiendo únicamente estos pasos, la instalación puede considerarse reproducible.
