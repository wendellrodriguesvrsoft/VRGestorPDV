import {
  IsBoolean,
  IsDefined,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

export class CreateEmpresaDto {
  @IsNotEmpty()
  @IsInt()
  rede!: number;

  @IsString()
  @IsNotEmpty()
  @IsDefined()
  @MaxLength(100)
  descricao!: string;

  @IsOptional()
  @IsBoolean()
  ativo!: boolean;
}
