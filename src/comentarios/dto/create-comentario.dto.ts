import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreateComentarioDto {
  @ApiProperty({ example: 'Ya reinicié el equipo y sigue sin conectar a la red.' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(2000)
  contenido: string;
}