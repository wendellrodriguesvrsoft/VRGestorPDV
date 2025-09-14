import { Module } from '@nestjs/common';
import { UsuariosService } from './usuarios.service';
import { UsuariosController } from './usuarios.controller';
import { Usuarios } from './entities/usuarios.entity';
import { UsuarioRede } from './entities/usuarios-rede.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { databaseProviders } from 'db/database.providers';

@Module({
  imports: [TypeOrmModule.forFeature([Usuarios, UsuarioRede])],
  controllers: [UsuariosController],
  providers: [UsuariosService, ...databaseProviders],
})
export class UsuariosModule {}
