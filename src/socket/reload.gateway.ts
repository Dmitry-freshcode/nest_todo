import { WebSocketGateway, WebSocketServer, SubscribeMessage, OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';

@WebSocketGateway()
export class ReloadGateway implements OnGatewayConnection, OnGatewayDisconnect {

    @WebSocketServer() server;
    
    users: number = 0;    

    async handleConnection(){        
        this.users++;        
        console.log(`${this.users} conected`);   
    }

    async handleDisconnect(){        
        this.users--;        
        console.log(`${this.users} conected`);
    }

    @SubscribeMessage('refresh')
    async onReload(client){
        //client.broadcast.emit('refresh');
        this.server.emit('refresh');  
    }   
}