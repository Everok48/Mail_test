import { Injectable, OnModuleInit } from '@nestjs/common';
// @ts-ignore
const Database = require('better-sqlite3');

@Injectable()
export class MailService implements OnModuleInit {
  private db: any;

  onModuleInit() {
    this.db = new Database('mail.db');
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
        isDraft INTEGER DEFAULT 0,
        isSent INTEGER DEFAULT 0,
        type TEXT
      )
    `,
      )
      .run();
  }

  getInbox(): any[] {
    return this.db
      .prepare(`SELECT * FROM mail WHERE type = 'inbox' ORDER BY date DESC`)
      .all();
  }

  getSent(): any[] {
    return this.db
      .prepare(`SELECT * FROM mail WHERE type = 'sent' ORDER BY date DESC`)
      .all();
  }

  getDrafts(): any[] {
    return this.db
      .prepare(`SELECT * FROM mail WHERE type = 'draft' ORDER BY date DESC`)
      .all();
  }

  getById(id: number): any {
    return this.db.prepare(`SELECT * FROM mail WHERE id = ?`).get(id);
  }

  create(mail: any): any {
    const stmt = this.db.prepare(
      `INSERT INTO mail (fromEmail, toEmail, subject, body, date, isDraft, isSent, type) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    );
    const info = stmt.run(
      mail.fromEmail,
      mail.toEmail,
      mail.subject,
      mail.body,
      mail.date || new Date().toISOString(),
      mail.isDraft ? 1 : 0,
      mail.isSent ? 1 : 0,
      mail.type || 'inbox',
    );
    return { id: info.lastInsertRowid, ...mail };
  }

  update(id: number, mail: any): any {
    const stmt = this.db.prepare(
      `UPDATE mail SET fromEmail = ?, toEmail = ?, subject = ?, body = ?, date = ?, isDraft = ?, isSent = ?, type = ? WHERE id = ?`,
    );
    stmt.run(
      mail.fromEmail,
      mail.toEmail,
      mail.subject,
      mail.body,
      mail.date || new Date().toISOString(),
      mail.isDraft ? 1 : 0,
      mail.isSent ? 1 : 0,
      mail.type || 'inbox',
      id,
    );
    return { id, ...mail };
  }

  delete(id: number): void {
    this.db.prepare(`DELETE FROM mail WHERE id = ?`).run(id);
  }
}
