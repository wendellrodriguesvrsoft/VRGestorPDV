import { Injectable } from '@nestjs/common';
import { CreatePdvDto } from './dto/create-pdv.dto';
import { UpdatePdvDto } from './dto/update-pdv.dto';

@Injectable()
export class PdvsService {
  create(createPdvDto: CreatePdvDto) {
    return 'This action adds a new pdv';
  }

  findAll() {
    return `This action returns all pdvs`;
  }

  findOne(id: number) {
    return `This action returns a #${id} pdv`;
  }

  update(id: number, updatePdvDto: UpdatePdvDto) {
    return `This action updates a #${id} pdv`;
  }

  remove(id: number) {
    return `This action removes a #${id} pdv`;
  }
}
