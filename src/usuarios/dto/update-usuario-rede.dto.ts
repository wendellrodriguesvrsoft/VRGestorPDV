import { IsInt, IsOptional } from 'class-validator';
import { CreateUsuarioRedeDto } from './create-usuario-rede.dto';
import { PartialType } from '@nestjs/mapped-types';

export class UpdateUsuarioRedeDto extends PartialType(CreateUsuarioRedeDto) {
  @IsOptional()
  @IsInt()
  id?: number;
}
