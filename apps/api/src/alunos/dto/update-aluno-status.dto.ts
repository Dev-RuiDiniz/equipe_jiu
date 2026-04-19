import { IsBoolean } from 'class-validator';

export class UpdateAlunoStatusDto {
  @IsBoolean()
  ativo!: boolean;
}
