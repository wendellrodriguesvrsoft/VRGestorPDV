import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { EmpresaService } from './empresa.service';
import { CreateEmpresaDto } from './dto/create-empresa.dto';
import { UpdateEmpresaDto } from './dto/update-empresa.dto';
import { Empresa } from './entities/empresa.entity';
import { ResponseData } from '../shared/interfaces/helper.interface';

@Controller('empresa')
export class EmpresaController {
  constructor(private readonly _empresaService: EmpresaService) {}

  @Post()
  async create(@Body() createEmpresaDto: CreateEmpresaDto): Promise<Empresa> {
    return this._empresaService.create(createEmpresaDto);
  }

  @Get()
  async findAll(): Promise<ResponseData<Empresa>> {
    return this._empresaService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Empresa> {
    return this._empresaService.findOne(+id);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateEmpresaDto: UpdateEmpresaDto,
  ): Promise<Empresa> {
    return this._empresaService.update(+id, updateEmpresaDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<void> {
    return this._empresaService.remove(+id);
  }
}
