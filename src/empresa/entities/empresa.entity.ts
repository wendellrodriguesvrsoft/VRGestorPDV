import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  JoinColumn,
  ManyToOne,
} from 'typeorm';
import { Loja } from '../../lojas/entities/loja.entity';
import { Rede } from '../../rede/entities/rede.entity';
import { CreateEmpresaDto } from '../dto/create-empresa.dto';
import { UpdateEmpresaDto } from '../dto/update-empresa.dto';

@Entity({ name: 'empresa' })
export class Empresa {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column('varchar', { length: 100, nullable: false })
  descricao!: string;

  @Column('boolean', { default: true })
  ativo!: boolean;

  @ManyToOne(() => Rede, (rede) => rede.empresa, {
    nullable: false,
    cascade: false,
    eager: true,
  })
  @JoinColumn({ name: 'idRede' })
  rede!: Rede;

  @OneToMany(() => Loja, (loja) => loja.empresa, {
    cascade: false,
  })
  loja?: Loja;

  constructor(createEmpresaDto: CreateEmpresaDto | UpdateEmpresaDto) {
    Object.assign(this, createEmpresaDto);
  }
}
