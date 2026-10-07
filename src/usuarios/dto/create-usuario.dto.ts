import {
  IsEmail,
  IsEnum,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Rol } from '../../generated/prisma/enums.js';

export class CreateUsuarioDto {
  @ApiProperty({
    description: 'Nombre del usuario',
    example: 'Kevin Rodriguez',
  })
  @IsString()
  @MinLength(2)
  nombre: string;

  @ApiProperty({
    example: 'kevin@mail.com',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    example: '12345678',
    minLength: 6,
  })
  @IsString()
  @MinLength(6)
  password: string;

  @ApiPropertyOptional({
    enum: Rol,
    default: Rol.EMPLEADO,
  })
  @IsOptional()
  @IsEnum(Rol)
  rol?: Rol;
}