import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AssociatePdvDto, CreatePdvDto } from './dto/create-pdv.dto';
import { UpdatePdvDto } from './dto/update-pdv.dto';
import { PDV } from './entities/pdv.entity';
import { createQueue } from '../rabbitmq/create-queue.helper';
import { ResponseData } from '../shared/interfaces/helper.interface';
import { AmqpConnection } from '@golevelup/nestjs-rabbitmq';

@Injectable()
export class PdvsService {
  constructor(
    @InjectRepository(PDV)
    private readonly pdvRepository: Repository<PDV>,
    private readonly amqp: AmqpConnection,
  ) {}

  async create(dto: CreatePdvDto): Promise<PDV> {
    const pdv = this.pdvRepository.create(dto);
    return this.pdvRepository.save(pdv);
  }

  async findAll(): Promise<ResponseData<PDV>> {
    const [result, total] = await this.pdvRepository.findAndCount({
      relations: ['loja'],
    });
    return {
      data: result,
      count: +total,
      pageSize: +total,
    };
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

  async associatePdv(dto: AssociatePdvDto): Promise<PDV> {
    const pdv = await this.pdvRepository
      .createQueryBuilder('pdv')
      .where('pdv.uuid = :uuid', { uuid: dto.uuid })
      .leftJoinAndSelect('pdv.loja', 'loja')
      .leftJoinAndSelect('loja.empresa', 'empresa')
      .leftJoinAndSelect('empresa.rede', 'rede')
      .getOne();

    if (!pdv) throw new NotFoundException(`PDV ${dto.uuid} não encontrado`);
    createQueue(this.amqp, `update-status-pdv-${pdv.loja.empresa.rede.id}`, pdv.id, this.updateStatusPdv.bind(this));
    createQueue(this.amqp, `update-files-pdv-${pdv.loja.empresa.rede.id}`, pdv.id, this.updateStatusPdv.bind(this), false);

    pdv.ativo = true;

    return this.pdvRepository.save(pdv);
  }

  updateStatusPdv(payload: unknown) {
    console.log('Payload recebido no PDV Service:', payload);
  }
}
