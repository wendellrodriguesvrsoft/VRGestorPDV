import { IsDefined, IsInt, IsString } from 'class-validator';

export class CreatePdvDto {
  @IsDefined()
  @IsInt()
  idLoja!: number;
}
