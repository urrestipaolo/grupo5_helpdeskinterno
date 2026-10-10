import 'dotenv/config';
import { PrismaPg } from '@prisma/adapter-pg';
import * as bcrypt from 'bcryptjs';
import { PrismaClient } from '../src/generated/prisma/client.js';
import { EstadoTicket, Prioridad, Rol } from '../src/generated/prisma/enums.js';

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error('Falta la variable de entorno DATABASE_URL');
}

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString }),
});

async function main() {
  // 1. Crear usuarios de prueba para los tres roles.
  const usuarios = [
    {
      nombre: 'Admin Help Desk',
      email: 'admin@helpdesk.com',
      rol: Rol.ADMIN,
    },
    {
      nombre: 'Agente Soporte',
      email: 'agente@helpdesk.com',
      rol: Rol.AGENTE,
    },
    {
      nombre: 'Empleado Uno',
      email: 'empleado@helpdesk.com',
      rol: Rol.EMPLEADO,
    },
    {
      nombre: 'Empleado Dos',
      email: 'empleado2@helpdesk.com',
      rol: Rol.EMPLEADO,
    },
  ];

  const password = await bcrypt.hash('Password123', 10);

  const usuariosCreados = await Promise.all(
    usuarios.map((usuario) =>
      prisma.usuario.upsert({
        where: { email: usuario.email },
        update: {},
        create: { ...usuario, password },
      }),
    ),
  );

  const empleado = usuariosCreados.find(
    (u) => u.email === 'empleado@helpdesk.com',
  )!;

  const empleado2 = usuariosCreados.find(
    (u) => u.email === 'empleado2@helpdesk.com',
  )!;

  const agente = usuariosCreados.find(
    (u) => u.email === 'agente@helpdesk.com',
  )!;

  // 2. Crear categorías de prueba.
  const categorias = [
    {
      nombre: 'Hardware',
      descripcion: 'Problemas con equipos y dispositivos físicos',
    },
    {
      nombre: 'Accesos',
      descripcion: 'Problemas de cuentas, contraseñas y permisos',
    },
    {
      nombre: 'Redes',
      descripcion: 'Problemas de conectividad y acceso a la red',
    },
  ];

  const categoriasCreadas = await Promise.all(
    categorias.map((categoria) =>
      prisma.categoria.upsert({
        where: { nombre: categoria.nombre },
        update: {},
        create: categoria,
      }),
    ),
  );

  const hardware = categoriasCreadas.find((c) => c.nombre === 'Hardware')!;

  const accesos = categoriasCreadas.find((c) => c.nombre === 'Accesos')!;

  const redes = categoriasCreadas.find((c) => c.nombre === 'Redes')!;

  // 3. Definir tickets en diferentes estados.
  const tickets = [
    {
      titulo: '[SEED] Computadora no enciende',
      descripcion: 'La computadora del empleado no enciende.',
      estado: EstadoTicket.ABIERTO,
      prioridad: Prioridad.ALTA,
      creadorId: empleado.id,
      agenteId: agente.id,
      categoriaId: hardware.id,
      cerradoEn: null,
    },
    {
      titulo: '[SEED] Error al abrir el sistema',
      descripcion: 'El sistema interno muestra un error al iniciar.',
      estado: EstadoTicket.EN_PROCESO,
      prioridad: Prioridad.MEDIA,
      creadorId: empleado2.id,
      agenteId: agente.id,
      categoriaId: accesos.id,
      cerradoEn: null,
    },
    {
      titulo: '[SEED] Problema de conexión',
      descripcion: 'El equipo no logra conectarse a la red.',
      estado: EstadoTicket.RESUELTO,
      prioridad: Prioridad.ALTA,
      creadorId: empleado.id,
      agenteId: agente.id,
      categoriaId: redes.id,
      cerradoEn: null,
    },
    {
      titulo: '[SEED] Instalación completada',
      descripcion: 'Se completó la instalación del programa solicitado.',
      estado: EstadoTicket.CERRADO,
      prioridad: Prioridad.BAJA,
      creadorId: empleado2.id,
      agenteId: agente.id,
      categoriaId: hardware.id,
      cerradoEn: new Date(),
    },
  ];

  // 4. Crear o actualizar los tickets sin duplicarlos.
  const ticketsCreados: Awaited<ReturnType<typeof prisma.ticket.create>>[] = [];

  for (const ticket of tickets) {
    const existente = await prisma.ticket.findFirst({
      where: { titulo: ticket.titulo },
    });

    const ticketGuardado = existente
      ? await prisma.ticket.update({
          where: { id: existente.id },
          data: ticket,
        })
      : await prisma.ticket.create({
          data: ticket,
        });

    ticketsCreados.push(ticketGuardado);
  }

  // 5. Definir comentarios para los tickets.
  const comentarios = [
    {
      tituloTicket: '[SEED] Computadora no enciende',
      contenido: 'Se reporta que el equipo no enciende desde esta mañana.',
      autorId: empleado.id,
    },
    {
      tituloTicket: '[SEED] Computadora no enciende',
      contenido: 'Se revisará la fuente de alimentación del equipo.',
      autorId: agente.id,
    },
    {
      tituloTicket: '[SEED] Error al abrir el sistema',
      contenido: 'Estamos revisando el error de acceso al sistema.',
      autorId: agente.id,
    },
    {
      tituloTicket: '[SEED] Problema de conexión',
      contenido: 'Se restableció la conexión a la red.',
      autorId: agente.id,
    },
    {
      tituloTicket: '[SEED] Instalación completada',
      contenido: 'El programa fue instalado y verificado correctamente.',
      autorId: agente.id,
    },
  ];

  // 6. Crear comentarios y evitar duplicados.
  for (const comentario of comentarios) {
    const ticket = ticketsCreados.find(
      (t) => t.titulo === comentario.tituloTicket,
    );

    if (!ticket) {
      throw new Error(`No se encontró el ticket: ${comentario.tituloTicket}`);
    }

    const existente = await prisma.comentario.findFirst({
      where: {
        ticketId: ticket.id,
        autorId: comentario.autorId,
        contenido: comentario.contenido,
      },
    });

    if (!existente) {
      await prisma.comentario.create({
        data: {
          ticketId: ticket.id,
          autorId: comentario.autorId,
          contenido: comentario.contenido,
        },
      });
    }
  }

  console.log(
    'Seed completado: usuarios, categorías, tickets y comentarios de prueba.',
  );
  console.log('Contraseña de prueba: Password123');
}

main()
  .catch((error) => {
    console.error('Error ejecutando el seed:', error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
