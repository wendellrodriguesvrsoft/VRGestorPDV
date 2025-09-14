import { Controller } from '@nestjs/common';
import { RedeService } from './rede.service';

@Controller('rede')
export class RedeController {
  constructor(private readonly redeService: RedeService) {}
}
