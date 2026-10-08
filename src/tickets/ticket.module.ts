import { Module } from "@nestjs/common";
import { TicketService } from "./ticket.service.js";
import { TicketController } from "./ticket.controller.js";
import { NotificacionesModule } from "../notificaciones/notificaciones.module.js";

@Module({
    imports: [NotificacionesModule],
    controllers: [TicketController],
    providers: [TicketService],
})
export class TicketModule {}