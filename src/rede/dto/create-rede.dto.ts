import {
  IsBoolean,
  IsDefined,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

export class CreateRedeDto {
  @IsString()
  @IsNotEmpty()
  @IsDefined()
  @MaxLength(100)
  descricao!: string;

  @IsOptional()
  @IsBoolean()
  ativo!: boolean;
}
