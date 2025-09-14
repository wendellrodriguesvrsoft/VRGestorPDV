import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Delete,
  Patch,
} from '@nestjs/common';
import { RedeService } from './rede.service';
import { CreateRedeDto } from './dto/create-rede.dto';
import { Rede } from './entities/rede.entity';
import { ResponseData } from '../shared/interfaces/helper.interface';
import { UpdateRedeDto } from './dto/update-rede.dto';

@Controller('rede')
export class RedeController {
  constructor(private readonly redeService: RedeService) {}

  @Post()
  async create(@Body() createRedeDto: CreateRedeDto): Promise<Rede> {
    return this.redeService.create(createRedeDto);
  }

  @Get()
  async findAll(): Promise<ResponseData<Rede>> {
    return this.redeService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Rede> {
    return this.redeService.findOne(+id);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateRedeDto: UpdateRedeDto,
  ): Promise<Rede> {
    return this.redeService.update(+id, updateRedeDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<void> {
    await this.redeService.remove(+id);
  }
}
