import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { PDV } from '../../pdvs/entities/pdv.entity';

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
}
