import {
  IsArray,
  IsBoolean,
  IsDefined,
  IsInt,
  IsNumber,
  IsOptional,
} from 'class-validator';

export class CreateUsuarioRedeDto {
  @IsOptional()
  @IsBoolean()
  ativo!: boolean;

  @IsDefined()
  @IsInt()
  idRede!: number;

  @IsDefined()
  @IsArray()
  @IsNumber({}, { each: true })
  idEmpresas!: number[];

  @IsDefined()
  @IsArray()
  @IsNumber({}, { each: true })
  idLojas!: number[];

  @IsDefined()
  @IsInt()
  idLojaPadrao!: number;
}
