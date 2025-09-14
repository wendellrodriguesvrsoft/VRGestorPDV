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

  @ManyToOne(() => Rede, (rede) => rede.loja, {
    nullable: false,
    cascade: false,
    eager: true,
  })
  @JoinColumn({ name: 'idRede' })
  rede!: Rede;
}
