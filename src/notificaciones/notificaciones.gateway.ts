import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { OnGatewayConnection, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import jwt from 'jsonwebtoken';
import type { Server, Socket } from 'socket.io';

@WebSocketGateway({ namespace: '/notificaciones', cors: { origin: '*' } })
export class NotificacionesGateway implements OnGatewayConnection {
  @WebSocketServer()
  server: Server;

  private readonly logger = new Logger(NotificacionesGateway.name);

  constructor(private readonly config: ConfigService) {}

  // Al conectarse, el cliente manda su JWT. Si es válido, entra a SU sala privada.
  async handleConnection(client: Socket) {
    const token =
      (client.handshake.auth?.token as string | undefined) ??
      (client.handshake.query?.token as string | undefined);

    try {
      if (!token) throw new Error('Falta el token');
      const payload = jwt.verify(
        token,
        this.config.getOrThrow<string>('JWT_SECRET'),
      ) as jwt.JwtPayload;

      const usuarioId = Number(payload.sub);
      await client.join(`usuario:${usuarioId}`);
      client.emit('conectado', { mensaje: 'Conectado a notificaciones', usuarioId });
      this.logger.log(`Usuario ${usuarioId} conectado a notificaciones`);
    } catch {
      client.emit('error', { mensaje: 'Token inválido o ausente' });
      client.disconnect(true);
    }
  }

  // Envía un evento solo a la sala de ese usuario
  enviarA(usuarioId: number, evento: string, datos: unknown) {
    this.server.to(`usuario:${usuarioId}`).emit(evento, datos);
  }
}