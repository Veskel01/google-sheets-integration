import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './Controllers/app.controller';
import { CrmService } from './Services/Crm.service';
import { CrmSettingsService } from './Services/CrmSettings.service';

import { DiscordService } from './Services/Discord.service';
@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
    }),
    HttpModule,
  ],
  controllers: [AppController],
  providers: [CrmService, CrmSettingsService, DiscordService],
})
export class AppModule {}
