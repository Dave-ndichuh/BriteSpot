import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MpesaModule } from './mpesa/mpesa.module';

@Module({
  imports: [MpesaModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
