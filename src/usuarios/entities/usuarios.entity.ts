import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { CreateUsuarioDto } from '../dto/create-usuario.dto';
import { UpdateUsuarioDto } from '../dto/update-usuario.dto';
import { UsuarioRede } from './usuarios-rede.entity';

@Entity({ name: 'usuarios' })
export class Usuarios {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('varchar', { length: 60, nullable: false })
  nome: string;

  @Column('varchar', { length: 100, nullable: false, unique: true })
  email: string;

  @Column('varchar', {
    length: 100,
    nullable: true,
    select: false,
    default: null,
  })
  senha!: string;

  @Column({ default: true })
  ativo: boolean;

  @OneToMany(() => UsuarioRede, (usuariosRede) => usuariosRede.usuarios)
  usuariosRede: UsuarioRede[];

  constructor(createUsuarioDto: CreateUsuarioDto | UpdateUsuarioDto) {
    Object.assign(this, createUsuarioDto);
  }
}
