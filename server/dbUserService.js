// server/dbUserService.js
const bcrypt = require('bcryptjs');
const pool = require('mysql2/promise');
const dotenv = require('dotenv');
dotenv.config();

const db = pool.createPool({
  host: process.env.HOST,
  user: process.env.DB_USER || process.env.USER || 'root',
  password: process.env.PASSWORD || '',
  database: process.env.DATABASE,
  port: Number(process.env.DB_PORT || 3306)
});

const rounds = Number(process.env.BCRYPT_ROUNDS || 10);

class DbUserService {
  static getInstance() {
    return new DbUserService();
  }

  // Register new user
  async register(username, password, firstname, lastname, salary, age) {
    try {
      const [existing] = await db.query('SELECT username FROM Users WHERE username = ?', [username]);
      if (existing.length > 0) {
        return { success: false, message: 'Username already exists' };
      }

      const hash = await bcrypt.hash(password, rounds);
      await db.query(
        'INSERT INTO Users (username, password_hash, firstname, lastname, salary, age) VALUES (?, ?, ?, ?, ?, ?)',
        [username, hash, firstname, lastname, salary, age]
      );
      return { success: true, message: 'User registered successfully' };
    } catch (err) {
      console.error(err);
      return { success: false, message: 'Registration failed' };
    }
  }

  // Login user
  async login(username, password) {
    try {
      const [rows] = await db.query('SELECT username, password_hash FROM Users WHERE username = ?', [username]);
      if (rows.length === 0) {
        return { success: false, message: 'User not found' };
      }

      const valid = await bcrypt.compare(password, rows[0].password_hash);
      if (!valid) {
        return { success: false, message: 'Invalid credentials' };
      }

      await db.query('UPDATE Users SET signintime = NOW() WHERE username = ?', [username]);
      return { success: true, message: 'Login successful' };
    } catch (err) {
      console.error(err);
      return { success: false, message: 'Login failed' };
    }
  }

    async searchByName(firstname, lastname) {
    try {
      let query = "SELECT * FROM Users WHERE 1=1";
      const params = [];

      if (firstname) {
        query += " AND firstname LIKE ?";
        params.push(`%${firstname}%`);
      }
      if (lastname) {
        query += " AND lastname LIKE ?";
        params.push(`%${lastname}%`);
      }

      const [rows] = await db.query(query, params);
      return rows;
    } catch (err) {
      console.error(err);
      return [];
    }
  }

    async searchByUserId(username) {
    try {
      const [rows] = await db.query("SELECT * FROM Users WHERE username = ?", [username]);
      return rows;
    } catch (err) {
      console.error(err);
      return [];
    }
  }

    async searchBySalaryRange(min, max) {
    try {
      const [rows] = await db.query("SELECT * FROM Users WHERE salary BETWEEN ? AND ?", [min, max]);
      return rows;
    } catch (err) {
      console.error(err);
      return [];
    }
  }

    async searchByAgeRange(min, max) {
    try {
      const [rows] = await db.query("SELECT * FROM Users WHERE age BETWEEN ? AND ?", [min, max]);
      return rows;
    } catch (err) {
      console.error(err);
      return [];
    }
  }

    async searchUsersRegisteredAfter(username) {
    try {
      const [rows] = await db.query(
        `SELECT * FROM Users 
         WHERE registerday > (SELECT registerday FROM Users WHERE username = ?)`,
        [username]
      );
      return rows;
    } catch (err) {
      console.error(err);
      return [];
    }
  }

    async searchUsersNeverSignedIn() {
    try {
      const [rows] = await db.query('SELECT * FROM Users WHERE signintime IS NULL');
      return rows;
    } catch (err) {
      console.error(err);
      return [];
    }
  }

    async searchUsersSameDayAs(username) {
    try {
      const [rows] = await db.query(
        `SELECT * FROM Users 
         WHERE DATE(registerday) = (SELECT DATE(registerday) FROM Users WHERE username = ?)`,
        [username]
      );
      return rows;
    } catch (err) {
      console.error(err);
      return [];
    }
  }

    async searchUsersRegisteredToday() {
    try {
      const [rows] = await db.query('SELECT * FROM Users WHERE DATE(registerday) = CURDATE()');
      return rows;
    } catch (err) {
      console.error(err);
      return [];
    }
  }

}

module.exports = DbUserService;
