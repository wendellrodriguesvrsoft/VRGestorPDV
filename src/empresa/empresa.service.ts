import { Injectable } from '@nestjs/common';
import { CreateEmpresaDto } from './dto/create-empresa.dto';
import { UpdateEmpresaDto } from './dto/update-empresa.dto';
import { Empresa } from './entities/empresa.entity';
import { Loja } from '../lojas/entities/loja.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { ResponseData } from '../shared/interfaces/helper.interface';

@Injectable()
export class EmpresaService {
  constructor(
    @InjectRepository(Empresa)
    private readonly empresaRepository: Repository<Empresa>,
    @InjectRepository(Loja)
    private readonly lojaRepository: Repository<Loja>,
  ) {}

  async create(createEmpresaDto: CreateEmpresaDto): Promise<Empresa> {
    const empresa = new Empresa(createEmpresaDto);
    return this.empresaRepository.save(empresa);
  }

  async findAll(): Promise<ResponseData<Empresa>> {
    const [result, total] = await this.empresaRepository
      .createQueryBuilder('empresa')
      .select(['empresa.id', 'empresa.ativo', 'empresa.descricao'])
      .innerJoin('empresa.rede', 'rede')
      .addSelect('rede.descricao')
      .getManyAndCount();

    return {
      data: result,
      count: +total,
      pageSize: +total,
    };
  }

  async findOne(id: number): Promise<Empresa> {
    const empresa = await this.empresaRepository.findOneOrFail({
      where: { id },
    });

    Object.assign(empresa, { rede: empresa.rede.id });

    return empresa;
  }

  async update(
    id: number,
    updateEmpresaDto: UpdateEmpresaDto,
  ): Promise<Empresa> {
    const empresaEntity = await this.findOne(id);

    if (
      updateEmpresaDto.ativo !== undefined &&
      empresaEntity.ativo !== updateEmpresaDto.ativo
    ) {
      this.updateLojasByIdEmpresa([id], updateEmpresaDto.ativo);
    }

    const empresa = new Empresa(updateEmpresaDto);
    await this.empresaRepository.update(id, empresa);
    return this.findOne(id);
  }

  private async updateLojasByIdEmpresa(
    id: number[],
    ativo: boolean,
  ): Promise<void> {
    await this.lojaRepository
      .createQueryBuilder('loja')
      .update({ ativo })
      .where(`"idEmpresa" IN (${id})`)
      .execute();
  }

  async remove(id: number): Promise<void> {
    await this.update(id, { ativo: false });
  }
}
