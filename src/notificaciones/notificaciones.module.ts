import { Module } from '@nestjs/common';
import { NotificacionesGateway } from './notificaciones.gateway.js';
import { NotificacionesService } from './notificaciones.service.js';

@Module({
  providers: [NotificacionesGateway, NotificacionesService],
  exports: [NotificacionesService],
})
export class NotificacionesModule {}