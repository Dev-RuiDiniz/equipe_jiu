import { IsEmail, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

export class CreateContatoDto {
  @IsString()
  @MinLength(2)
  @MaxLength(100)
  nome!: string;

  @IsEmail()
  email!: string;

  @IsString()
  @MinLength(5)
  mensagem!: string;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  interesse?: string;
}
