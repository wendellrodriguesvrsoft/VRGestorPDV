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
import { ResponseData } from '../shared/interfaces/helper.interface';
import { PDV } from './entities/pdv.entity';

@Controller('pdvs')
export class PdvsController {
  constructor(private readonly pdvsService: PdvsService) {}

  @Post()
  create(@Body() createPdvDto: CreatePdvDto): Promise<PDV> {
    return this.pdvsService.create(createPdvDto);
  }

  @Get()
  findAll(): Promise<ResponseData<PDV>> {
    return this.pdvsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<PDV> {
    return this.pdvsService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updatePdvDto: UpdatePdvDto,
  ): Promise<PDV> {
    return this.pdvsService.update(+id, updatePdvDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<void> {
    return this.pdvsService.remove(+id);
  }

  @Post('/associar')
  associatePdv(@Body() associatePdvDto: AssociatePdvDto): Promise<void> {
    return this.pdvsService.associatePdv(associatePdvDto);
  }
}
