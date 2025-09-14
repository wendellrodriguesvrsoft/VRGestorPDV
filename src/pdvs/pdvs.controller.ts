import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { PdvsService } from './pdvs.service';
import { AssociatePdvDto, CreatePdvDto } from './dto/create-pdv.dto';
import { UpdatePdvDto } from './dto/update-pdv.dto';

@Controller('pdvs')
export class PdvsController {
  constructor(private readonly pdvsService: PdvsService) {}

  @Post()
  create(@Body() createPdvDto: CreatePdvDto) {
    return this.pdvsService.create(createPdvDto);
  }

  @Get()
  findAll() {
    return this.pdvsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.pdvsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePdvDto: UpdatePdvDto) {
    return this.pdvsService.update(+id, updatePdvDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.pdvsService.remove(+id);
  }

  @Post('/associar')
  associatePdv(@Body() associatePdvDto: AssociatePdvDto) {
    return this.pdvsService.associatePdv(associatePdvDto);
  }

}
