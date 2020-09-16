import { WebSocketGateway, WebSocketServer, SubscribeMessage, OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';

@WebSocketGateway()
export class ReloadGateway implements OnGatewayConnection, OnGatewayDisconnect {

    @WebSocketServer() server;
    users: number = 0;    

    async handleConnection(){
        //console.log(this.server);
        this.users++;
        //this.server.emit('test', `your are ${this.users} connected`);
        console.log(`${this.users} conected`);

    }

    async handleDisconnect(){        
        this.users--;
        //this.server.emit('users', this.users);
        console.log(`${this.users} conected`);

    }

    @SubscribeMessage('reload')
    async onReload(client){
        //client.broadcast.emit('reload');
        this.server.emit('reload');
        //console.log('reload DB');
    }

    @SubscribeMessage('logout')
    async onLogout(client){
        //client.broadcast.emit('reload');
        client.broadcast.emit('logout');
        //console.log('logout');
    }

    @SubscribeMessage('login')
    async onLogin(client){
        //client.broadcast.emit('reload');
        client.broadcast.emit('login');
        //console.log('login');
    }
}