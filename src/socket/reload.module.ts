import { Module } from '@nestjs/common';
import { ReloadGateway } from './reload.gateway'

@Module({
    providers: [ ReloadGateway ]
})
export class ReloadModule {}