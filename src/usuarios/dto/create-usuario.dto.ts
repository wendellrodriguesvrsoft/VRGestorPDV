import { Type } from 'class-transformer';
import {
  ArrayNotEmpty,
  IsArray,
  IsDefined,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  ValidateNested,
} from 'class-validator';
import { CreateUsuarioRedeDto } from './create-usuario-rede.dto';

export class CreateUsuarioDto {
  @IsString()
  @IsNotEmpty()
  @IsDefined()
  @MaxLength(60)
  nome!: string;

  @IsString()
  @IsNotEmpty()
  @IsDefined()
  @IsEmail()
  @MaxLength(100)
  email!: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  senha!: string;

  @IsOptional()
  @IsArray()
  @ArrayNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => CreateUsuarioRedeDto)
  usuariosRede!: CreateUsuarioRedeDto[];
}
