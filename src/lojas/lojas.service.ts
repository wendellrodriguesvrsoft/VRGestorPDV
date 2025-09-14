import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateLojaDto } from './dto/create-loja.dto';
import { UpdateLojaDto } from './dto/update-loja.dto';
import { Loja } from './entities/loja.entity';

@Injectable()
export class LojasService {
  constructor(
    @InjectRepository(Loja)
    private readonly lojaRepository: Repository<Loja>,
  ) {}

  async create(dto: CreateLojaDto): Promise<Loja> {
    const loja = this.lojaRepository.create(dto);
    return this.lojaRepository.save(loja);
  }

  async findAll(): Promise<Loja[]> {
    return this.lojaRepository.find({ relations: ['pdvs'] });
  }

  async findOne(id: number): Promise<Loja> {
    const loja = await this.lojaRepository.findOne({
      where: { id },
      relations: ['pdvs'],
    });
    if (!loja) throw new NotFoundException(`Loja ${id} não encontrada`);
    return loja;
  }

  async update(id: number, dto: UpdateLojaDto): Promise<Loja> {
    const loja = await this.findOne(id);
    Object.assign(loja, dto);
    return this.lojaRepository.save(loja);
  }

  async remove(id: number): Promise<void> {
    const loja = await this.findOne(id);
    await this.lojaRepository.remove(loja);
  }
}
