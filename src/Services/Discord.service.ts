import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';
import { FormDtoType } from 'src/Services/Services.types';

@Injectable()
export class DiscordService {
  private readonly logger = new Logger(DiscordService.name);

  constructor(
    private readonly http: HttpService,
    private readonly configService: ConfigService,
  ) {}

  public async sendMessageToChannel(url: string, formData: FormDtoType) {
    const webhookUrl = this.configService.get('WEBHOOK_URL');
    try {
      await firstValueFrom(
        this.http.post(webhookUrl, {
          content: 'Pojawiła się nowa Ankieta',
          embeds: [
            {
              title: 'Livespace - link',
              url,
              fields: [
                {
                  name: 'Github:',
                  value:
                    formData.Abyśmy_moglisprawdzićTwojeaktualneosiągnięciazostawnamlinkdoswojegogithubalubnazwę,
                },
                {
                  name: 'Kiedy się skontaktować:',
                  value:
                    formData.Dodaj_informacjęotymkiedymożemydoCiebiezadzwonićlubnapisać,
                },
                {
                  name: 'Kontakt',
                  value:
                    formData.Zostaw_swójemailnumertelefonużebyśmymoglisięzTobąskontaktować,
                },
              ],
            },
          ],
        }),
      );
    } catch (e) {
      this.logger.log(e);
      throw new Error('Wystąpił błąd z Discordem');
    }
  }

  public async sendDiscordError(message: string) {
    const webhookUrl = this.configService.get('WEBHOOK_URL');
    await firstValueFrom(
      this.http.post(webhookUrl, {
        content: message ? message : 'Wystąpił błąd z ankietą.',
      }),
    );
  }
}
