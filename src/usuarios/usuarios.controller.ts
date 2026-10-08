import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { UsuariosService } from './usuarios.service.js';
import { CreateUsuarioDto } from './dto/create-usuario.dto.js';
import { UpdateUsuarioDto } from './dto/update-usuario.dto.js';
import {
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
  ApiQuery,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { Rol } from '../generated/prisma/enums.js';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { RolesGuard } from '../auth/guards/roles.guard.js';
import { Roles } from '../auth/decorators/roles.decorator.js';
import { QueryUsuariosDto } from './dto/query-usuarios.dto.js';

@ApiTags('Usuarios')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiResponse({
  status: 401,
  description: 'Token no proporcionado o inválido',
})
@ApiResponse({
  status: 403,
  description: 'No tiene permisos para realizar esta acción',
})
@Controller('usuarios')
export class UsuariosController {
  constructor(private readonly usuariosService: UsuariosService) {}

  @Post()
  @Roles(Rol.ADMIN)
  @ApiOperation({
    summary: 'Crear un usuario',
    description:
      'Endpoint administrativo. Solo un ADMIN puede crear usuarios con rol ADMIN, AGENTE o EMPLEADO. El registro público debe crear usuarios únicamente con rol EMPLEADO.',
  })
  @ApiResponse({
    status: 201,
    description: 'Usuario creado correctamente',
  })
  @ApiResponse({
    status: 409,
    description: 'El correo ya está registrado',
  })
  create(@Body() createUsuarioDto: CreateUsuarioDto) {
    return this.usuariosService.create(createUsuarioDto);
  }

  @Get()
  @Roles(Rol.ADMIN, Rol.AGENTE)
  @ApiOperation({
    summary: 'Obtener todos los usuarios filtrados por rol (opcional)',
  })
  // @ApiQuery({
  //   name: 'rol',
  //   required: false,
  //   enum: Rol,
  //   description: 'Filtrar usuarios por rol',
  // })
  findAll(@Query() query: QueryUsuariosDto) {
    return this.usuariosService.findAll(query);
  }

  @Get(':id')
  @Roles(Rol.ADMIN, Rol.AGENTE)
  @ApiOperation({ summary: 'Obtener un usuario por ID' })
  @ApiParam({
    name: 'id',
    type: Number,
    example: 1,
  })
  @ApiResponse({
    status: 404,
    description: 'Usuario no encontrado',
  })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.usuariosService.findOne(id);
  }

  @Patch(':id')
  @Roles(Rol.ADMIN)
  @ApiOperation({ summary: 'Actualizar un usuario' })
  @ApiParam({
    name: 'id',
    type: Number,
    example: 1,
  })
  @ApiResponse({
    status: 404,
    description: 'Usuario no encontrado',
  })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUsuarioDto: UpdateUsuarioDto,
  ) {
    return this.usuariosService.update(id, updateUsuarioDto);
  }

  @Delete(':id')
  @Roles(Rol.ADMIN)
  @ApiOperation({ summary: 'Desactivar un usuario' })
  @ApiParam({
    name: 'id',
    type: Number,
    example: 1,
  })
  @ApiResponse({
    status: 404,
    description: 'Usuario no encontrado',
  })
  @ApiResponse({
    status: 409,
    description: 'El usuario ya se encuentra inactivo',
  })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.usuariosService.remove(id);
  }

  @Patch(':id/reactivate')
  @Roles(Rol.ADMIN)
  @ApiOperation({ summary: 'Reactivar un usuario' })
  @ApiParam({
    name: 'id',
    type: Number,
    example: 1,
  })
  @ApiResponse({
    status: 404,
    description: 'Usuario no encontrado',
  })
  @ApiResponse({
    status: 409,
    description: 'El usuario ya se encuentra activo',
  })
  reactivate(@Param('id', ParseIntPipe) id: number) {
    return this.usuariosService.reactivate(id);
  }
}
