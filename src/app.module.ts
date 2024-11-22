import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PixelGateway } from './pixel-war/pixel-war.gateway';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [AppService, PixelGateway],
})
export class AppModule {}
