import 'dotenv/config';
import { PrismaPg } from '@prisma/adapter-pg';
import * as bcrypt from 'bcryptjs';
import { PrismaClient } from '../src/generated/prisma/client.js';
import { Rol } from '../src/generated/prisma/enums.js';

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL ?? '' }),
});

const usuarios = [
  { nombre: 'Admin Help Desk', email: 'admin@helpdesk.com', rol: Rol.ADMIN },
  { nombre: 'Agente Soporte', email: 'agente@helpdesk.com', rol: Rol.AGENTE },
  { nombre: 'Empleado Uno', email: 'empleado@helpdesk.com', rol: Rol.EMPLEADO },
  { nombre: 'Empleado Dos', email: 'empleado2@helpdesk.com', rol: Rol.EMPLEADO },
];

async function main() {
  const password = await bcrypt.hash('Password123', 10);
  for (const u of usuarios) {
    await prisma.usuario.upsert({
      where: { email: u.email },
      update: {},
      create: { ...u, password },
    });
  }
  console.log('Seed: usuarios de prueba creados (contraseña: Password123)');
}

main()
  .catch((e) => {
    console.error(e);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());