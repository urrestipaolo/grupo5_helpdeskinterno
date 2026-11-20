import { Type } from 'class-transformer';
import {
  IsDateString,
  IsEnum,
  IsInt,
  IsOptional,
  Max,
  Min,
} from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { EstadoTicket, Prioridad } from '../../generated/prisma/enums.js';

export class QueryTicketsDto {
  @ApiPropertyOptional({
    example: 1,
    default: 1,
    description: 'Número de página',
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page: number = 1;

  @ApiPropertyOptional({
    example: 10,
    default: 10,
    description: 'Cantidad de registros por página',
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit: number = 10;

  // ---- Filtros opcionales: si no se mandan, el listado funciona igual que antes ----

  @ApiPropertyOptional({
    enum: EstadoTicket,
    description: 'Filtrar por estado',
  })
  @IsOptional()
  @IsEnum(EstadoTicket, {
    message: 'El estado debe ser ABIERTO, EN_PROCESO, RESUELTO o CERRADO',
  })
  estado?: EstadoTicket;

  @ApiPropertyOptional({
    enum: Prioridad,
    description: 'Filtrar por prioridad',
  })
  @IsOptional()
  @IsEnum(Prioridad, { message: 'La prioridad debe ser BAJA, MEDIA o ALTA' })
  prioridad?: Prioridad;

  @ApiPropertyOptional({ example: 1, description: 'Filtrar por categoría' })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  categoriaId?: number;

  @ApiPropertyOptional({
    example: 1,
    description:
      'Filtrar por agente asignado. Usar 0 para ver los tickets sin asignar',
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  agenteId?: number;

  @ApiPropertyOptional({
    example: '2026-11-01',
    description: 'Creados desde esta fecha (inclusive)',
  })
  @IsOptional()
  @IsDateString({}, { message: 'desde debe tener el formato AAAA-MM-DD' })
  desde?: string;

  @ApiPropertyOptional({
    example: '2026-11-30',
    description: 'Creados hasta esta fecha (inclusive)',
  })
  @IsOptional()
  @IsDateString({}, { message: 'hasta debe tener el formato AAAA-MM-DD' })
  hasta?: string;
}
