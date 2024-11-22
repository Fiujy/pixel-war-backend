import { Module } from '@nestjs/common';
import { PixelGateway } from './pixel-war.gateway';

@Module({
  providers: [PixelGateway],
})
export class AppModule {}
