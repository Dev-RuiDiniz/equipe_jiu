import { IsOptional, IsString } from 'class-validator';

export class CancelarAulaDto {
  @IsOptional()
  @IsString()
  motivo?: string;
}
