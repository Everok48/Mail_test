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
        isSent INTEGER DEFAULT 0
      )
    `,
      )
      .run();
  }

  getInbox(): any[] {
    return this.db
      .prepare(
        `SELECT * FROM mail WHERE isSent = 1 AND isDraft = 0 ORDER BY date DESC`,
      )
      .all();
  }

  getSent(): any[] {
    return this.db
      .prepare(
        `SELECT * FROM mail WHERE isSent = 1 AND isDraft = 0 ORDER BY date DESC`,
      )
      .all();
  }

  getDrafts(): any[] {
    return this.db
      .prepare(`SELECT * FROM mail WHERE isDraft = 1 ORDER BY date DESC`)
      .all();
  }

  getById(id: number): any {
    return this.db.prepare(`SELECT * FROM mail WHERE id = ?`).get(id);
  }

  create(mail: any): any {
    const stmt = this.db.prepare(
      `INSERT INTO mail (fromEmail, toEmail, subject, body, date, isDraft, isSent) VALUES (?, ?, ?, ?, ?, ?, ?)`,
    );
    const info = stmt.run(
      mail.fromEmail,
      mail.toEmail,
      mail.subject,
      mail.body,
      mail.date || new Date().toISOString(),
      mail.isDraft ? 1 : 0,
      mail.isSent ? 1 : 0,
    );
    return { id: info.lastInsertRowid, ...mail };
  }

  update(id: number, mail: any): any {
    const stmt = this.db.prepare(
      `UPDATE mail SET fromEmail = ?, toEmail = ?, subject = ?, body = ?, date = ?, isDraft = ?, isSent = ? WHERE id = ?`,
    );
    stmt.run(
      mail.fromEmail,
      mail.toEmail,
      mail.subject,
      mail.body,
      mail.date || new Date().toISOString(),
      mail.isDraft ? 1 : 0,
      mail.isSent ? 1 : 0,
      id,
    );
    return { id, ...mail };
  }

  delete(id: number): void {
    this.db.prepare(`DELETE FROM mail WHERE id = ?`).run(id);
  }
}
