import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import Database from 'better-sqlite3';

import { UserEntity } from './user.entity';

@Injectable()
export class UserService {
  private db: Database.Database;

  constructor() {
    this.db = new Database('mail.db');
    this.db
      .prepare(
        `
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        email TEXT UNIQUE,
        password TEXT
      )
    `,
      )
      .run();
    this.seedTestUser();
  }

  async seedTestUser() {
    const email = 'test@mail.ru';
    const password = '123456';
    const existing = this.findByEmail(email);
    if (!existing) {
      await this.createUser(email, password);
    }
  }

  async createUser(email: string, password: string): Promise<UserEntity> {
    const hash = await bcrypt.hash(password, 10);
    const stmt = this.db.prepare(
      'INSERT INTO users (email, password) VALUES (?, ?)',
    );
    const info = stmt.run(email, hash);
    return { id: info.lastInsertRowid as number, email, password: hash };
  }

  findByEmail(email: string): UserEntity | undefined {
    const row = this.db
      .prepare('SELECT * FROM users WHERE email = ?')
      .get(email) as UserEntity | undefined;
    return row;
  }

  async validatePassword(email: string, password: string): Promise<boolean> {
    const user = this.findByEmail(email);
    if (!user) return false;
    return bcrypt.compare(password, user.password);
  }
}
