import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
} from '@nestjs/common';
import { MailService } from './mail.service';
import { CreateMailDto, UpdateMailDto, MailEntity } from './dto/mail.dto';
import { ValidationPipe } from '@nestjs/common';

@Controller('mails')
export class MailController {
  constructor(private readonly mailService: MailService) {}

  @Get('seed')
  seedDatabase() {
    return this.mailService.seed();
  }

  @Get('inbox')
  getInbox(): MailEntity[] {
    return this.mailService.getInbox();
  }

  @Get('sent')
  getSent(): MailEntity[] {
    return this.mailService.getSent();
  }

  @Get('drafts')
  getDrafts(): MailEntity[] {
    return this.mailService.getDrafts();
  }

  @Get(':id')
  getById(@Param('id') id: string): MailEntity | undefined {
    return this.mailService.getById(Number(id));
  }

  @Post()
  create(@Body(new ValidationPipe()) mail: CreateMailDto): MailEntity {
    return this.mailService.create(mail);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body(new ValidationPipe()) mail: UpdateMailDto,
  ): MailEntity | undefined {
    return this.mailService.update(Number(id), mail);
  }

  @Delete(':id')
  delete(@Param('id') id: string): void {
    return this.mailService.delete(Number(id));
  }
}
