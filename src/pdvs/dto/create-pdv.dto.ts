import { IsDefined, IsInt, IsUUID } from 'class-validator';

export class CreatePdvDto {
  @IsDefined()
  @IsInt()
  idLoja!: number;
}

export class AssociatePdvDto {
  @IsDefined()
  @IsUUID()
  uuid!: string;
}
