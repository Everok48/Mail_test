import { Injectable, OnModuleInit } from '@nestjs/common';
import type { Database } from 'better-sqlite3';
import {
  MailEntity,
  CreateMailDto,
  UpdateMailDto,
  MailType,
} from './dto/mail.dto';
// @ts-ignore
const DatabaseLib = require('better-sqlite3');

@Injectable()
export class MailService implements OnModuleInit {
  private db!: Database;

  onModuleInit() {
    this.db = new DatabaseLib('mail.db');
    this.db
      .prepare(
        `
      CREATE TABLE IF NOT EXISTS mail (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        fromEmail TEXT,
        toEmail TEXT,
        subject TEXT,
        body TEXT,
        date TEXT,
        type TEXT
      )
    `,
      )
      .run();
  }

  getInbox(): MailEntity[] {
    return this.db
      .prepare(`SELECT * FROM mail WHERE type = 'inbox' ORDER BY date DESC`)
      .all() as MailEntity[];
  }

  getSent(): MailEntity[] {
    return this.db
      .prepare(`SELECT * FROM mail WHERE type = 'sent' ORDER BY date DESC`)
      .all() as MailEntity[];
  }

  getDrafts(): MailEntity[] {
    return this.db
      .prepare(`SELECT * FROM mail WHERE type = 'draft' ORDER BY date DESC`)
      .all() as MailEntity[];
  }

  getById(id: number): MailEntity | undefined {
    return this.db.prepare(`SELECT * FROM mail WHERE id = ?`).get(id) as
      | MailEntity
      | undefined;
  }

  create(mail: CreateMailDto): MailEntity {
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
  }

  update(id: number, mail: UpdateMailDto): MailEntity | undefined {
    const oldMail = this.getById(id);
    if (!oldMail) return undefined;
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
  }

  delete(id: number): void {
    this.db.prepare(`DELETE FROM mail WHERE id = ?`).run(id);
  }
}
