import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { UsuariosService } from './usuarios.service';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import { Usuarios } from './entities/usuarios.entity';
import { ResponseData } from '../shared/interfaces/helper.interface';

@Controller('usuarios')
export class UsuariosController {
  constructor(private readonly _usuariosService: UsuariosService) {}

  @Get()
  async findAll(): Promise<ResponseData<Usuarios>> {
    return this._usuariosService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Usuarios> {
    return this._usuariosService.findOne(+id);
  }

  @Post()
  async create(@Body() createUsuarioDto: CreateUsuarioDto): Promise<Usuarios> {
    return this._usuariosService.create(createUsuarioDto);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateUsuarioDto: UpdateUsuarioDto,
  ): Promise<Usuarios> {
    return this._usuariosService.update(+id, updateUsuarioDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<Usuarios> {
    return this._usuariosService.remove(+id);
  }
}
