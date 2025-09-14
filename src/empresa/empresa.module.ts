import { Module } from '@nestjs/common';
import { EmpresaService } from './empresa.service';
import { EmpresaController } from './empresa.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Empresa } from './entities/empresa.entity';
import { Loja } from '../lojas/entities/loja.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Empresa, Loja])],
  controllers: [EmpresaController],
  providers: [EmpresaService],
})
export class EmpresaModule {}
