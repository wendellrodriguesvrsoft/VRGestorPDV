import { IsDefined, IsInt, IsString } from 'class-validator';

export class CreateLojaDto {
  @IsDefined()
  @IsString()
  descricao: string;

  @IsDefined()
  @IsInt()
  empresa:number

  @IsDefined()
  @IsString()
  cnpj!: string;
}
