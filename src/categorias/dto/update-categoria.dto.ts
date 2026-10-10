import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

export class UpdateCategoriaDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  nombre?: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  descripcion?: string;
}
