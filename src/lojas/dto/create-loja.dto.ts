import { IsDefined, IsString } from 'class-validator';

export class CreateLojaDto {
  @IsDefined()
  @IsString()
  descricao: string;
}
