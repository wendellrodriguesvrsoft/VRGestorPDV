import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Loja } from '../../lojas/entities/loja.entity';

@Entity('pdv')
export class PDV {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  uuid: string;

  @Column({ default: true })
  ativo: boolean;

  @ManyToOne(() => Loja, (loja) => loja.pdvs, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'idLoja' })
  loja: Loja;

  @Column()
  idLoja: number;
}
