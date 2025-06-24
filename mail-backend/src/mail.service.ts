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
      console.log('[SEED] Starting database seeding...');
      this.db.exec(this.createTableStmt);
      console.log('[SEED] Table ensured to exist.');

      const insertStmt = this.db.prepare(
        `INSERT INTO mail (fromEmail, toEmail, subject, body, date, type) VALUES (?, ?, ?, ?, ?, ?)`,
      );

      const seedTransaction = this.db.transaction(() => {
        const deleteInfo = this.db.prepare(`DELETE FROM mail`).run();
        console.log(`[SEED] Deleted ${deleteInfo.changes} existing rows.`);

        let insertedCount = 0;
        const runInsert = (type, body = faker.lorem.paragraphs()) => {
          const from =
            type === MailType.SENT ? 'me@example.com' : faker.internet.email();
          const to =
            type === MailType.SENT ? faker.internet.email() : 'me@example.com';
          const info = insertStmt.run(
            from,
            to,
            faker.lorem.sentence(),
            body,
            faker.date.recent().toISOString(),
            type,
          );
          if (info.changes > 0) insertedCount++;
        };

        for (let i = 0; i < 15; i++) runInsert(MailType.INBOX);
        for (let i = 0; i < 10; i++) runInsert(MailType.SENT);
        for (let i = 0; i < 5; i++) runInsert(MailType.DRAFT, '');

        console.log(
          `[SEED] Attempted to insert 30 rows. Successful inserts: ${insertedCount}`,
        );
      });

      seedTransaction();

      console.log('[SEED] Seeding transaction completed.');
      return {
        message:
          'Database seeding process finished. Check server console for details.',
      };
    } catch (error) {
      console.error('[SEED] CRITICAL ERROR during seeding:', error);
      throw error; // Re-throw the error to be visible in the browser as a 500 error
    }
  }

  getInbox(): MailEntity[] {
    console.log('[API] Fetching inbox...');
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
