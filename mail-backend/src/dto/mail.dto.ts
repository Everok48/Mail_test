import {
  IsString,
  IsOptional,
  IsEnum,
  IsEmail,
  IsNotEmpty,
} from 'class-validator';
import { Transform } from 'class-transformer';

export enum MailType {
  INBOX = 'inbox',
  SENT = 'sent',
  DRAFT = 'draft',
}

export interface MailEntity {
  id: number;
  fromEmail: string;
  toEmail: string;
  subject: string;
  body: string;
  date: string;
  type: MailType;
}

export class CreateMailDto {
  @IsEmail()
  @IsNotEmpty()
  fromEmail!: string;

  @Transform(({ value }) => (value === '' ? null : value))
  @IsOptional()
  @IsEmail()
  toEmail!: string;

  @Transform(({ value }) => (value === '' ? null : value))
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  subject!: string;

  @IsString()
  body!: string;

  @IsOptional()
  @IsString()
  date?: string;

  @IsEnum(MailType)
  type!: MailType;
}

export class UpdateMailDto {
  @IsOptional()
  @IsEmail()
  fromEmail?: string;

  @IsOptional()
  @IsEmail()
  toEmail?: string;

  @Transform(({ value }) => (value === '' ? null : value))
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  subject?: string;

  @IsOptional()
  @IsString()
  body?: string;

  @IsOptional()
  @IsString()
  date?: string;

  @IsOptional()
  @IsEnum(MailType)
  type?: MailType;
}
