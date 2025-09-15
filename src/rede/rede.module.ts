import { Module } from '@nestjs/common';
import { RedeService } from './rede.service';
import { RedeController } from './rede.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Rede } from './entities/rede.entity';
import { Loja } from '../lojas/entities/loja.entity';
import { PDV } from '../pdvs/entities/pdv.entity';

@Module({
    imports: [TypeOrmModule.forFeature([PDV, Loja, Rede])],
  controllers: [RedeController],
  providers: [RedeService],
})
export class RedeModule {}
