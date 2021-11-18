import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';
import { IAccessTokenRes } from './Services.types';
import sha1 from 'sha1';

@Injectable()
export class CrmSettingsService {
  private logger: Logger = new Logger();

  constructor(
    private readonly configService: ConfigService,
    private readonly http: HttpService,
  ) {}

  public async getInitialSettings() {
    const tokenUrl = `${this.configService.get('LIVESPACE_TOKEN_URL')}`;

    const apiKey = this.configService.get('API_KEY');
    const apiSecret = this.configService.get('API_SECRET');

    try {
      const { data } = await firstValueFrom(
        this.http.post<IAccessTokenRes>(tokenUrl, null, {
          params: { _api_auth: 'key', _api_key: apiKey },
        }),
      );

      const {
        data: { session_id, token },
      } = data;

      const _api_sha = sha1(`${apiKey}${token}${apiSecret}`);

      return {
        _api_auth: 'key',
        _api_key: apiKey,
        _api_sha,
        _api_session: session_id,
      };
    } catch (e) {
      this.logger.log(e.message);
      throw new Error('Wystąpił błąd z tokenem uwierzytelniającym');
    }
  }
}
