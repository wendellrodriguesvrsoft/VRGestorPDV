import { Module } from '@nestjs/common';
import { PdvsService } from './pdvs.service';
import { PdvsController } from './pdvs.controller';
import { LojasModule } from '../lojas/lojas.module';
import { PDV } from './entities/pdv.entity';
import { Loja } from '../lojas/entities/loja.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([PDV, Loja])],
  controllers: [PdvsController],
  providers: [PdvsService],
})
export class PdvsModule {}
