import { Injectable } from '@nestjs/common';
import { CreateRedeDto } from './dto/create-rede.dto';
import { UpdateRedeDto } from './dto/update-rede.dto';
import { Rede } from './entities/rede.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { ResponseData } from '../shared/interfaces/helper.interface';

@Injectable()
export class RedeService {
  constructor(
    @InjectRepository(Rede)
    private readonly redeRepository: Repository<Rede>,
  ) {}

  async create(createRedeDto: CreateRedeDto): Promise<Rede> {
    const rede = new Rede(createRedeDto);

    const savedRede = await this.redeRepository.save(rede);

    return savedRede;
  }

  async findAll(): Promise<ResponseData<Rede>> {
    const [result, total] = await this.redeRepository
      .createQueryBuilder('rede')
      .select(['rede.id', 'rede.ativo', 'rede.descricao'])
      .where('rede.ativo = true')
      .orderBy('rede.descricao', 'ASC')
      .getManyAndCount();

    return {
      data: result,
      count: +total,
      pageSize: +total,
    };
  }

  async findOne(id: number): Promise<Rede> {
    const rede = await this.redeRepository.findOneOrFail({
      where: { id },
    });

    return rede;
  }

  async update(id: number, updateRedeDto: UpdateRedeDto): Promise<Rede> {
    const redeToUpdate = new Rede(updateRedeDto);

    redeToUpdate.id = +id;

    const updatedRede = await this.redeRepository.save(redeToUpdate);

    return updatedRede;
  }

  async remove(id: number): Promise<void> {
    await this.update(id, { ativo: false });
  }
}
