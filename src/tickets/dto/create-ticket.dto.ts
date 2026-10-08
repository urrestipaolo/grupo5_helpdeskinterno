import { Type } from 'class-transformer';
import { EstadoTicket, Prioridad } from '../../generated/prisma/enums.js';
import {
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  Min,
  MinLength,
} from 'class-validator';

export class CreateTicketDto {
  @IsString({ message: 'El titulo debe ser un texto' })
  @IsNotEmpty({ message: 'El titulo es obligatorio' })
  @MinLength(3, { message: 'El titulo debe tener minimo tres caracteres' })
  @Matches(/\S/, { message: 'El nombre  no puede contener solo espacios' })
  titulo: string;

  @IsString({ message: 'La descripción debe ser un texto' })
  @IsNotEmpty({ message: 'La descripción es obligatorio' })
  @MinLength(2, { message: 'La descripción debe tener minimo dos caracteres' })
  @Matches(/\S/, { message: 'La descripción  no puede contener solo espacios' })
  descripcion: string;

  @IsOptional()
  @IsEnum(EstadoTicket, {
    message: 'El estado debe ser ABIERTO, EN_PROCESO, RESUELTO, CERRADO',
  })
  estado?: EstadoTicket;

  @IsString({ message: 'El estado debe ser un texto' })
  @IsNotEmpty({ message: 'El estado es obligatorio' })
  @IsEnum(Prioridad, { message: 'La prioridad debe ser BAJA, MEDIA, ALTA' })
  prioridad: Prioridad;

  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'Debe ser un ID valido' })
  @Min(0, { message: 'No ingrese una ID negativo' })
  agenteId?: number;

  @Type(() => Number)
  @IsInt({ message: 'Debe ser un ID valido' })
  @Min(0, { message: 'No ingrese una ID negativo' })
  @IsNotEmpty({ message: 'La ID de categoria es obligatoria' })
  categoriaId: number;
}
