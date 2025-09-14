import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreatePdvDto } from './dto/create-pdv.dto';
import { UpdatePdvDto } from './dto/update-pdv.dto';
import { PDV } from './entities/pdv.entity';

@Injectable()
export class PdvsService {
  constructor(
    @InjectRepository(PDV)
    private readonly pdvRepository: Repository<PDV>,
  ) {}

  async create(dto: CreatePdvDto): Promise<PDV> {
    const pdv = this.pdvRepository.create(dto);
    return this.pdvRepository.save(pdv);
  }

  async findAll(): Promise<PDV[]> {
    return this.pdvRepository.find({ relations: ['loja'] });
  }

  async findOne(id: number): Promise<PDV> {
    const pdv = await this.pdvRepository.findOne({
      where: { id },
      relations: ['loja'],
    });
    if (!pdv) throw new NotFoundException(`PDV ${id} não encontrado`);
    return pdv;
  }

  async update(id: number, dto: UpdatePdvDto): Promise<PDV> {
    const pdv = await this.findOne(id);
    Object.assign(pdv, dto);
    return this.pdvRepository.save(pdv);
  }

  async remove(id: number): Promise<void> {
    const pdv = await this.findOne(id);
    await this.pdvRepository.remove(pdv);
  }
}
