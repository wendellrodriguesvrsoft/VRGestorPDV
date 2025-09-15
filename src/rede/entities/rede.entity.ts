import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Empresa } from '../../empresa/entities/empresa.entity';
import { Loja } from '../../lojas/entities/loja.entity';
import { CreateRedeDto } from '../dto/create-rede.dto';
import { UpdateRedeDto } from '../dto/update-rede.dto';

@Entity({ name: 'rede' })
export class Rede {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column('varchar', { length: 100, nullable: false })
  descricao!: string;

  @OneToMany(() => Empresa, (empresa) => empresa.rede, {
    cascade: false,
  })
  empresa?: Empresa;

  @Column('boolean', { default: true })
  ativo!: boolean;

  constructor(createRedeDto: CreateRedeDto | UpdateRedeDto) {
    Object.assign(this, createRedeDto);
  }
}
