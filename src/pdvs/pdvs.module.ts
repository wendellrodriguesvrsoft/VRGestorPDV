import { Module } from '@nestjs/common';
import { PdvsService } from './pdvs.service';
import { PdvsController } from './pdvs.controller';

@Module({
  controllers: [PdvsController],
  providers: [PdvsService],
})
export class PdvsModule {}
