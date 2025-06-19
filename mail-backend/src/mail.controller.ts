import { Controller, Get, Post, Put, Delete, Param, Body } from '@nestjs/common';
import { MailService } from './mail.service';

@Controller('mails')
export class MailController {
  constructor(private readonly mailService: MailService) {}

  @Get('inbox')
  getInbox() {
    return this.mailService.getInbox();
  }

  @Get('sent')
  getSent() {
    return this.mailService.getSent();
  }

  @Get('drafts')
  getDrafts() {
    return this.mailService.getDrafts();
  }

  @Get(':id')
  getById(@Param('id') id: string) {
    return this.mailService.getById(Number(id));
  }

  @Post()
  create(@Body() mail: any) {
    return this.mailService.create(mail);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() mail: any) {
    return this.mailService.update(Number(id), mail);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.mailService.delete(Number(id));
  }
} 