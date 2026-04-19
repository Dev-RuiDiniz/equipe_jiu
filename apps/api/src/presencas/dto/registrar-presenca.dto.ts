import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class RegistrarPresencaDto {
  @IsString()
  aulaId!: string;

  @IsString()
  alunoId!: string;

  @IsBoolean()
  presente!: boolean;

  @IsOptional()
  @IsString()
  observacao?: string;
}
