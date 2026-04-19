import { IsDateString, IsInt, IsOptional, IsString, MaxLength, Min } from 'class-validator';

export class CreateAulaDto {
  @IsString()
  @MaxLength(150)
  titulo!: string;

  @IsOptional()
  @IsString()
  descricao?: string;

  @IsString()
  professorId!: string;

  @IsString()
  @MaxLength(50)
  modalidade!: string;

  @IsDateString()
  dataHora!: string;

  @IsInt()
  @Min(1)
  duracaoMin!: number;

  @IsOptional()
  @IsInt()
  @Min(1)
  vagas?: number;
}
