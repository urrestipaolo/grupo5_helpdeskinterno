import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { UsuariosService } from './usuarios.service.js';
import { PrismaService } from '../prisma/prisma.service.js';
import { Rol } from '../generated/prisma/enums.js';

describe('UsuariosService', () => {
  let service: UsuariosService;

  const prismaMock = {
    usuario: {
      findUnique: vi.fn(),
      findMany: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
    },
  };

  beforeEach(() => {
    vi.clearAllMocks();

    service = new UsuariosService(prismaMock as unknown as PrismaService);
  });

  it('debería crear el servicio', () => {
    expect(service).toBeDefined();
  });

  it('debería listar usuarios', async () => {
    prismaMock.usuario.findMany.mockResolvedValue([
      {
        id: 1,
        nombre: 'Usuario Prueba',
        email: 'usuario@test.com',
        rol: Rol.EMPLEADO,
        activo: true,
        creadoEn: new Date(),
      },
    ]);

    const resultado = await service.findAll();

    expect(resultado).toHaveLength(1);
    expect(prismaMock.usuario.findMany).toHaveBeenCalled();
  });

  it('debería encontrar un usuario por id', async () => {
    prismaMock.usuario.findUnique.mockResolvedValue({
      id: 1,
      nombre: 'Usuario Prueba',
      email: 'usuario@test.com',
      rol: Rol.EMPLEADO,
      activo: true,
      creadoEn: new Date(),
    });

    const resultado = await service.findOne(1);

    expect(resultado.id).toBe(1);
    expect(resultado.email).toBe('usuario@test.com');
  });

  it('debería lanzar error si el usuario no existe', async () => {
    prismaMock.usuario.findUnique.mockResolvedValue(null);

    await expect(service.findOne(999)).rejects.toBeInstanceOf(
      NotFoundException,
    );
  });

  it('debería rechazar email duplicado al crear', async () => {
    prismaMock.usuario.findUnique.mockResolvedValue({
      id: 1,
      email: 'repetido@test.com',
    });

    await expect(
      service.create({
        nombre: 'Usuario',
        email: 'repetido@test.com',
        password: '12345678',
        rol: Rol.EMPLEADO,
      }),
    ).rejects.toBeInstanceOf(ConflictException);
  });

  it('debería desactivar un usuario activo', async () => {
    prismaMock.usuario.findUnique.mockResolvedValue({
      id: 1,
      nombre: 'Usuario',
      email: 'usuario@test.com',
      rol: Rol.EMPLEADO,
      activo: true,
      creadoEn: new Date(),
    });

    prismaMock.usuario.update.mockResolvedValue({
      id: 1,
      nombre: 'Usuario',
      email: 'usuario@test.com',
      rol: Rol.EMPLEADO,
      activo: false,
      creadoEn: new Date(),
    });

    const resultado = await service.remove(1);

    expect(resultado.activo).toBe(false);

    expect(prismaMock.usuario.update).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { id: 1 },
        data: { activo: false },
      }),
    );
  });

  it('debería rechazar desactivar un usuario ya inactivo', async () => {
    prismaMock.usuario.findUnique.mockResolvedValue({
      id: 1,
      nombre: 'Usuario',
      email: 'usuario@test.com',
      rol: Rol.EMPLEADO,
      activo: false,
      creadoEn: new Date(),
    });

    await expect(service.remove(1)).rejects.toBeInstanceOf(ConflictException);
  });

  it('debería reactivar un usuario inactivo', async () => {
    prismaMock.usuario.findUnique.mockResolvedValue({
      id: 1,
      nombre: 'Usuario',
      email: 'usuario@test.com',
      rol: Rol.EMPLEADO,
      activo: false,
      creadoEn: new Date(),
    });

    prismaMock.usuario.update.mockResolvedValue({
      id: 1,
      nombre: 'Usuario',
      email: 'usuario@test.com',
      rol: Rol.EMPLEADO,
      activo: true,
      creadoEn: new Date(),
    });

    const resultado = await service.reactivate(1);

    expect(resultado.activo).toBe(true);
  });
});
