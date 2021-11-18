import { Body, Controller, Logger, Post } from '@nestjs/common';
import { CrmService } from '../Services/Crm.service';
import { FormDtoType } from '../Services/Services.types';

@Controller()
export class AppController {
  private readonly logger: Logger = new Logger(AppController.name);

  constructor(private readonly crmService: CrmService) {}

  @Post('form')
  async handleFormRequest(@Body() formData: FormDtoType) {
    try {
      await this.crmService.createNewUser(formData);
    } catch (e) {
      this.logger.log(e);
    }
  }
}
