import { beforeEach, describe, expect, it, vi } from 'vitest';
import { UsuariosController } from './usuarios.controller.js';
import { UsuariosService } from './usuarios.service.js';
import { Rol } from '../generated/prisma/enums.js';

describe('UsuariosController', () => {
  let controller: UsuariosController;

  const usuariosServiceMock = {
    findAll: vi.fn(),
    findOne: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    remove: vi.fn(),
    reactivate: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();

    controller = new UsuariosController(
      usuariosServiceMock as unknown as UsuariosService,
    );
  });

  it('debería crear el controller', () => {
    expect(controller).toBeDefined();
  });

  it('debería listar usuarios', async () => {
    usuariosServiceMock.findAll.mockResolvedValue([]);

    const resultado = await controller.findAll();

    expect(resultado).toEqual([]);
    expect(usuariosServiceMock.findAll).toHaveBeenCalled();
  });

  it('debería filtrar usuarios por rol', async () => {
    usuariosServiceMock.findAll.mockResolvedValue([]);

    await controller.findAll(Rol.AGENTE);

    expect(usuariosServiceMock.findAll).toHaveBeenCalledWith(Rol.AGENTE);
  });

  it('debería obtener un usuario por id', async () => {
    usuariosServiceMock.findOne.mockResolvedValue({
      id: 1,
      nombre: 'Usuario Prueba',
    });

    const resultado = await controller.findOne(1);

    expect(resultado.id).toBe(1);
    expect(usuariosServiceMock.findOne).toHaveBeenCalledWith(1);
  });
});
