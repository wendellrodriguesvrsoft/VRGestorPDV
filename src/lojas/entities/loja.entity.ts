import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { PDV } from '../../pdvs/entities/pdv.entity';
import { Rede } from '../../rede/entities/rede.entity';
import { Empresa } from '../../empresa/entities/empresa.entity';
import { CreateLojaDto } from '../dto/create-loja.dto';
import { UpdateLojaDto } from '../dto/update-loja.dto';

@Entity('loja')
export class Loja {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  descricao: string;

  @Column({ default: true })
  ativo: boolean;

  @OneToMany(() => PDV, (pdv) => pdv.loja)
  pdvs: PDV[];

  @Column('char', { length: 14, nullable: false })
  cnpj!: string;

  @ManyToOne(() => Empresa, (empresa) => empresa.loja, {
    nullable: false,
    cascade: false,
    eager: true,
  })
  @JoinColumn({ name: 'idEmpresa' })
  empresa!: Empresa;

  constructor(
    payload: CreateLojaDto | UpdateLojaDto,
  ) {
    Object.assign(this, payload);
  }
}
