import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';
import { ConfigService } from '@nestjs/config';

// utils
import { getPhoneOrEmail } from '../Utils/getEmailOrPhone';
import { getRandomName } from '../Utils/randomNames';
import { DateTime } from 'luxon';

// services
import { CrmSettingsService } from '../Services/CrmSettings.service';
import { DiscordService } from './Discord.service';

// types
import { FormDtoType } from '../Services/Services.types';

// fields
import { crmFields } from '../Utils/crmFields';

@Injectable()
export class CrmService {
  private readonly _groupID: string;

  private readonly crmUrl: string = 'https://lha.livespace.io/api/public/json';

  private logger: Logger = new Logger();

  constructor(
    private readonly crmSettingsService: CrmSettingsService,
    private readonly http: HttpService,
    private readonly configService: ConfigService,
    private readonly discordService: DiscordService,
  ) {
    this._groupID = configService.get('GROUP_ID');
  }

  private async crmRequestWithContactResponse(
    endpoint: string,
    data: Record<string, unknown>,
  ) {
    try {
      const initialSettings =
        await this.crmSettingsService.getInitialSettings();

      const result = await firstValueFrom(
        this.http.post(`${this.crmUrl}${endpoint}`, {
          ...initialSettings,
          ...data,
        }),
      );
      if (result.data.result !== 200) throw result.data;

      return result.data.data;
    } catch (e) {
      throw new Error('Wystąpił problem z zapytaniem CRM');
    }
  }

  public async createNewUser(formData: FormDtoType) {
    const requestBody = this.prepareRequestBody(formData);

    try {
      const {
        contact: { id },
      } = await this.crmRequestWithContactResponse(
        '/Contact/addContact',
        requestBody,
      );

      const contactUrl = `https://lha.livespace.io/Contact/contact/details/api_id/${id}`;
      await this.discordService.sendMessageToChannel(contactUrl, formData);
    } catch (e) {
      this.logger.log(e);
      await this.discordService.sendDiscordError(e.message);
    }
  }

  private prepareRequestBody(data: FormDtoType) {
    const {
      Zostaw_swójemailnumertelefonużebyśmymoglisięzTobąskontaktować:
        emailOrPhone,
      Abyśmy_moglisprawdzićTwojeaktualneosiągnięciazostawnamlinkdoswojegogithubalubnazwę:
        githubName,
    } = data;

    const { type: emailOrPhoneType, value: emailOrPhoneValue } =
      getPhoneOrEmail(emailOrPhone);

    const [firstname, lastname] = getRandomName();

    const requestBody = {
      contact: {
        firstname,
        lastname,
        created: DateTime.local().toISO(),
        groups: [this._groupID],
        emails: [
          emailOrPhoneType === 'email' && emailOrPhoneValue.length >= 5
            ? emailOrPhoneValue
            : null,
        ],
        phones: [emailOrPhoneType === 'phone' ? emailOrPhoneValue : null],
        dataset: {
          [crmFields.githubName]: githubName,
          [crmFields.formFields]: `${Object.entries(data).map(
            ([key, value]) => `

            ##${key}:
            ${value}`,
          )}`,
        },
      },
    };

    return requestBody;
  }
}
