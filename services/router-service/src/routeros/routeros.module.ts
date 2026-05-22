import { Module } from '@nestjs/common';
import { RouterosService } from './routeros.service';

@Module({
  providers: [RouterosService],
  exports: [RouterosService],
})
export class RouterosModule {}
