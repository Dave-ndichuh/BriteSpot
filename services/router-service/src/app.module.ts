import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RouterosModule } from './routeros/routeros.module';

@Module({
  imports: [RouterosModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
