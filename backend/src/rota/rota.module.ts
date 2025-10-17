import { Module } from '@nestjs/common';
import { RotaController } from './rota.controller';
import { RotaService } from './rota.service';
import { DatabaseModule } from '../database/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [RotaController],
  providers: [RotaService],
  exports: [RotaService],
})
export class RotaModule {}