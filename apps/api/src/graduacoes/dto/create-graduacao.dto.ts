import { IsDateString, IsInt, IsOptional, IsString, MaxLength, Min } from 'class-validator';

export class CreateGraduacaoDto {
  @IsString()
  alunoId!: string;

  @IsString()
  @MaxLength(30)
  faixa!: string;

  @IsInt()
  @Min(0)
  grau!: number;

  @IsDateString()
  dataGraduacao!: string;

  @IsString()
  professorId!: string;

  @IsOptional()
  @IsString()
  observacao?: string;
}
