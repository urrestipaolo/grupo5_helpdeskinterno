<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

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

Backend para un sistema interno de gestión de incidencias y requerimientos técnicos.

El sistema permite registrar usuarios, administrar tickets, categorías y comentarios, asignar incidencias a agentes y controlar el acceso mediante roles.

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
- Vitest

## Requisitos previos

Antes de instalar el proyecto se debe contar con:

- Node.js
- npm
- PostgreSQL
- Git

## Instalación

Clonar el repositorio:

```bash
git clone https://github.com/urrestipaolo/grupo5_helpdeskinterno.git

## Decisiones de negocio

El equipo definió las siguientes reglas generales para el Help Desk:

- Los usuarios tienen un único rol directo: `ADMIN`, `AGENTE` o `EMPLEADO`.
- Los empleados pueden registrar incidencias y consultar los tickets que les corresponden.
- Los agentes gestionan y atienden tickets.
- Los administradores tienen acceso a funciones administrativas del sistema.
- Los tickets utilizan los estados:
  - `ABIERTO`
  - `EN_PROCESO`
  - `RESUELTO`
  - `CERRADO`
- Las prioridades disponibles son:
  - `BAJA`
  - `MEDIA`
  - `ALTA`
- La eliminación de usuarios se realiza mediante baja lógica, conservando el registro en la base de datos.
- Los usuarios inactivos no deben ser considerados para nuevas asignaciones.
- El registro público de usuarios debe crear cuentas con rol `EMPLEADO`.
- Los roles internos `ADMIN` y `AGENTE` deben ser asignados únicamente mediante funciones administrativas.

## Notificaciones

El mecanismo de notificaciones será documentado en esta sección una vez que el equipo complete la historia US-18 y defina si se utilizarán WebSockets, correo electrónico u otra alternativa.

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

Nest is [MIT licensed](https://github.com/nestjs/nest/blob/master/LICENSE).
```
