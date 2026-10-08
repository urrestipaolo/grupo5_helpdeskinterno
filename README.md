# Help Desk Interno

Backend para la gestión interna de incidencias y requerimientos técnicos.

Permite registrar usuarios, autenticar mediante JWT, gestionar tickets, categorías y comentarios, asignar incidencias a agentes y restringir acciones según el rol del usuario.

## Tecnologías

- Node.js
- NestJS
- TypeScript
- PostgreSQL
- Prisma ORM
- JWT
- bcryptjs
- Swagger
- class-validator
- Vitest

## Requisitos

Antes de instalar el proyecto se necesita:

- Node.js
- npm
- PostgreSQL
- Git

## Instalación

Clonar el repositorio:

```bash
git clone https://github.com/urrestipaolo/grupo5_helpdeskinterno.git
```

Ingresar al proyecto:

```bash
cd grupo5_helpdeskinterno
```

Instalar dependencias:

```bash
npm install
```

## Variables de entorno

Crear un archivo `.env` en la raíz del proyecto tomando como referencia `.env.example`.

Ejemplo:

```env
NODE_ENV="development"
PORT=3000
DATABASE_URL="postgresql://postgres:password@localhost:5432/helpdesk?schema=public"
JWT_SECRET="cambia_esta_clave_por_una_de_al_menos_32_caracteres"
JWT_EXPIRES_IN="8h"
```

> El archivo `.env` no debe subirse al repositorio.

## Base de datos

Generar el cliente de Prisma:

```bash
npx prisma generate
```

Aplicar las migraciones:

```bash
npx prisma migrate dev
```

Cargar usuarios de prueba:

```bash
npx tsx prisma/seed.ts
```

Usuarios creados por el seed:

| Rol      | Email                  | Contraseña  |
| -------- | ---------------------- | ----------- |
| ADMIN    | admin@helpdesk.com     | Password123 |
| AGENTE   | agente@helpdesk.com    | Password123 |
| EMPLEADO | empleado@helpdesk.com  | Password123 |
| EMPLEADO | empleado2@helpdesk.com | Password123 |

## Ejecutar el proyecto

Modo desarrollo:

```bash
npm run start:dev
```

La API se ejecuta por defecto en:

```text
http://localhost:3000
```

## Swagger

Con el servidor iniciado, la documentación de la API está disponible en:

```text
http://localhost:3000/api
```

Swagger permite consultar y probar los endpoints disponibles.

## Pruebas

Ejecutar todas las pruebas:

```bash
npm test
```

Ejecutar una prueba específica:

```bash
npm test -- usuarios.service.spec.ts
```

## Roles

El sistema utiliza tres roles:

- `ADMIN`: funciones administrativas.
- `AGENTE`: gestión de incidencias asignadas.
- `EMPLEADO`: creación y seguimiento de sus incidencias.

El registro público crea usuarios con rol `EMPLEADO`.

Los roles `ADMIN` y `AGENTE` son roles internos y deben ser asignados mediante funciones administrativas.

## Estados de tickets

Los tickets utilizan los estados:

- `ABIERTO`
- `EN_PROCESO`
- `RESUELTO`
- `CERRADO`

Prioridades disponibles:

- `BAJA`
- `MEDIA`
- `ALTA`

## Usuarios

El módulo de usuarios incluye:

- creación de usuarios;
- listado y consulta;
- filtro por rol;
- paginación;
- actualización;
- baja lógica;
- reactivación;
- protección mediante JWT y roles.

La eliminación de usuarios se realiza mediante baja lógica para conservar el historial.

## Notificaciones

El mecanismo de notificaciones será documentado cuando se complete la implementación de las historias US-18, US-19 y US-20.

## Flujo Git del equipo

El equipo trabaja mediante ramas por funcionalidad.

Flujo general:

```text
feature/*
   ↓
Pull Request
   ↓
Revisión
   ↓
master
```

Los merges a `master` son realizados por el Scrum Master después de la revisión correspondiente.
