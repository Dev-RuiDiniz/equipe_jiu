import { IsDateString, IsInt, IsOptional, IsString, MaxLength, Min, MinLength } from 'class-validator';

export class CreateAlunoDto {
  @IsString()
  @MinLength(2)
  @MaxLength(100)
  nome!: string;

  @IsString()
  @MaxLength(14)
  cpf!: string;

  @IsOptional()
  @IsDateString()
  dataNascimento?: string;

  @IsString()
  @MaxLength(30)
  faixa!: string;

  @IsInt()
  @Min(0)
  grau!: number;

  @IsOptional()
  @IsString()
  telefone?: string;

  @IsOptional()
  @IsString()
  fotoUrl?: string;
}
