import { IsBoolean } from 'class-validator';

export class MarcarContatoLidoDto {
  @IsBoolean()
  lido!: boolean;
}
