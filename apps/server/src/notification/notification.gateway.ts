import { forwardRef, Inject, Injectable, Logger } from '@nestjs/common';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { SocketEvents } from '@repo/shared/enums';

import { Server, Socket } from 'socket.io';
import { NotificationService } from './notification.service';
import { UserService } from '@/user/user.service';

let socketUsers: { socket: Socket; userId: string }[] = [];

@Injectable()
@WebSocketGateway({
  cors: {
    origin: '*',
  },
  transport: ['websocket'],
})
export class NotificationGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  private readonly logger = new Logger(NotificationGateway.name);

  constructor(
    private readonly userService: UserService,
    @Inject(forwardRef(() => NotificationService))
    private notificationService: NotificationService,
  ) {}

  @WebSocketServer() io: Server;

  afterInit() {
    this.logger.log('Initialized');
  }

  get getSocketUsers() {
    return socketUsers;
  }

  handleConnection(client: Socket) {
    const { sockets } = this.io.sockets;

    this.logger.log(`Client id: ${client.id} connected`);
    this.logger.debug(`Number of connected clients: ${sockets.size}`);
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Cliend id:${client.id} disconnected`);
    socketUsers = socketUsers.filter((u) => u.socket.id !== client.id);

    this.logger.log(`Total users: `, socketUsers.length);
  }

  @SubscribeMessage(SocketEvents.ADD_USER)
  async handleAddUser(socket: Socket, { userId }: { userId: string }) {
    const user = await this.userService.findById(userId);
    if (user) {
      const initialNotificationsCount =
        await this.notificationService.getAllUnreadCount(user);
      socketUsers.push({ socket, userId });

      socket.emit(
        SocketEvents.INITIAL_NOTIFICATIONS_COUNT,
        initialNotificationsCount,
      );
    }
  }

  emitNotificationCreate(userId: string) {
    const socket = socketUsers.find((u) => u.userId === userId)?.socket;

    if (socket) {
      socket.emit(SocketEvents.APPOINTMENT_CREATED);
    }
  }

  emitNotificationRead(userId: string) {
    const socket = socketUsers.find((u) => u.userId === userId)?.socket;

    if (socket) {
      socket.emit(SocketEvents.NOTIFICATION_READ);
    }
  }
}
