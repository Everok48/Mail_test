import { Injectable, OnModuleInit } from '@nestjs/common';
import type { Database } from 'better-sqlite3';
import { faker } from '@faker-js/faker';
import * as path from 'path';
import {
  MailEntity,
  CreateMailDto,
  UpdateMailDto,
  MailType,
} from './dto/mail.dto';
import { HttpException, HttpStatus } from '@nestjs/common';
// @ts-ignore
const DatabaseLib = require('better-sqlite3');

@Injectable()
export class MailService implements OnModuleInit {
  private db!: Database;
  private readonly createTableStmt: string = `
    CREATE TABLE IF NOT EXISTS mail (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      fromEmail TEXT,
      toEmail TEXT,
      subject TEXT,
      body TEXT,
      date TEXT,
      type TEXT
    )
  `;

  constructor() {
    const dbPath = path.join(__dirname, '..', 'mail.db');
    this.db = new DatabaseLib(dbPath);
    this.db.exec(this.createTableStmt);
  }

  onModuleInit() {}

  seed() {
    try {
      this.db.exec(this.createTableStmt);
      const insertStmt = this.db.prepare(
        `INSERT INTO mail (fromEmail, toEmail, subject, body, date, type) VALUES (?, ?, ?, ?, ?, ?)`,
      );
      const seedTransaction = this.db.transaction(() => {
        this.db.prepare(`DELETE FROM mail`).run();
        for (let i = 0; i < 15; i++) {
          insertStmt.run(
            faker.internet.email(),
            'me@example.com',
            faker.lorem.sentence(),
            faker.lorem.paragraphs(),
            faker.date.recent().toISOString(),
            MailType.INBOX,
          );
        }
        for (let i = 0; i < 10; i++) {
          insertStmt.run(
            'me@example.com',
            faker.internet.email(),
            faker.lorem.sentence(),
            faker.lorem.paragraphs(),
            faker.date.recent().toISOString(),
            MailType.SENT,
          );
        }
        for (let i = 0; i < 5; i++) {
          insertStmt.run(
            'me@example.com',
            faker.internet.email(),
            Math.random() > 0.5 ? '' : 'Черновик',
            faker.lorem.paragraphs(),
            faker.date.recent().toISOString(),
            MailType.DRAFT,
          );
        }
      });
      seedTransaction();
      return { message: 'Database seeding process finished.' };
    } catch (error) {
      throw error;
    }
  }

  getByType(type: MailType): MailEntity[] {
    const validTypes = Object.values(MailType);
    if (!validTypes.includes(type)) {
      throw new HttpException('Неверный тип почты', HttpStatus.BAD_REQUEST);
    }
    return this.db
      .prepare(`SELECT * FROM mail WHERE type = ? ORDER BY date DESC`)
      .all(type) as MailEntity[];
  }

  getById(id: number): MailEntity | undefined {
    const mail = this.db.prepare(`SELECT * FROM mail WHERE id = ?`).get(id) as
      | MailEntity
      | undefined;
    if (!mail) {
      throw new HttpException('Письмо не найдено', HttpStatus.NOT_FOUND);
    }
    return mail;
  }

  create(mail: CreateMailDto): MailEntity {
    try {
      const stmt = this.db.prepare(
        `INSERT INTO mail (fromEmail, toEmail, subject, body, date, type) VALUES (?, ?, ?, ?, ?, ?)`,
      );
      const info = stmt.run(
        mail.fromEmail,
        mail.toEmail,
        mail.subject,
        mail.body,
        mail.date || new Date().toISOString(),
        mail.type || MailType.INBOX,
      );
      return {
        id: Number(info.lastInsertRowid),
        ...mail,
        date: mail.date || new Date().toISOString(),
      };
    } catch (error) {
      throw new HttpException(
        'Ошибка создания письма',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  update(id: number, mail: UpdateMailDto): MailEntity | undefined {
    const oldMail = this.getById(id);
    if (!oldMail) {
      throw new HttpException('Письмо не найдено', HttpStatus.NOT_FOUND);
    }
    try {
      const updated: MailEntity = {
        ...oldMail,
        ...mail,
        date: mail.date || new Date().toISOString(),
      };
      const stmt = this.db.prepare(
        `UPDATE mail SET fromEmail = ?, toEmail = ?, subject = ?, body = ?, date = ?, type = ? WHERE id = ?`,
      );
      stmt.run(
        updated.fromEmail,
        updated.toEmail,
        updated.subject,
        updated.body,
        updated.date,
        updated.type,
        id,
      );
      return updated;
    } catch (error) {
      throw new HttpException(
        'Ошибка обновления письма',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  delete(id: number): void {
    const mail = this.getById(id);
    if (!mail) {
      throw new HttpException('Письмо не найдено', HttpStatus.NOT_FOUND);
    }
    try {
      this.db.prepare(`DELETE FROM mail WHERE id = ?`).run(id);
    } catch (error) {
      throw new HttpException(
        'Ошибка удаления письма',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  generateFakeIncoming(count: number = 2): MailEntity[] {
    const insertStmt = this.db.prepare(
      `INSERT INTO mail (fromEmail, toEmail, subject, body, date, type) VALUES (?, ?, ?, ?, ?, ?)`,
    );
    const newMails: MailEntity[] = [];
    for (let i = 0; i < count; i++) {
      const fromEmail = faker.internet.email();
      const toEmail = 'me@example.com';
      const subject = faker.lorem.sentence();
      const body = faker.lorem.paragraphs();
      const date = new Date().toISOString();
      const type = MailType.INBOX;
      const info = insertStmt.run(
        fromEmail,
        toEmail,
        subject,
        body,
        date,
        type,
      );
      newMails.push({
        id: Number(info.lastInsertRowid),
        fromEmail,
        toEmail,
        subject,
        body,
        date,
        type,
      });
    }
    return newMails;
  }
}
