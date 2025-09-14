import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { CreateUsuarioDto } from '../dto/create-usuario.dto';
import { UpdateUsuarioDto } from '../dto/update-usuario.dto';
import { Usuarios } from './usuarios.entity';

@Entity({ name: 'usuariorede' })
export class UsuarioRede {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column('boolean', { default: true })
  ativo!: boolean;

  @Column('integer', { nullable: false })
  idRede!: number;

  @Column('integer', { nullable: true, array: true, default: {} })
  idEmpresas!: number[];

  @Column('integer', { nullable: true, array: true, default: {} })
  idLojas!: number[];

  @Column('integer')
  idLojaPadrao!: number;

  @ManyToOne(() => Usuarios, (usuario) => usuario.usuariosRede, {
    nullable: false,
    cascade: false,
    eager: true,
  })
  @JoinColumn({ name: 'idUsuario' })
  usuarios!: Usuarios;

  constructor(createUsuarioDto: CreateUsuarioDto | UpdateUsuarioDto) {
    Object.assign(this, createUsuarioDto);
  }
}
