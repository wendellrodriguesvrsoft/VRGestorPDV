import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { Usuarios } from './usuarios.entity';

@Entity({ name: 'usuariosrede' })
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

  idUsuario!: number;

  constructor(createUsuarioRedeDto?: Partial<UsuarioRede>) {
    if (createUsuarioRedeDto) {
      Object.assign(this, createUsuarioRedeDto);
    }
  }
}
