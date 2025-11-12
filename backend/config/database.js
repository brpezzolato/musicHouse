import mysql from 'mysql2/promise';
import bcrypt from 'bcryptjs';

// Carregar variáveis de ambiente
import dotenv from 'dotenv';
dotenv.config();

const pool = mysql.createPool({
  host: process.env.NODE_DATABASE_HOST, // host do banco de dados
  user: process.env.NODE_DATABASE_USER, // usuário banco de dados
  password: process.env.NODE_DATABASE_PASSWORD || '', // senha banco de dados
  database: process.env.NODE_DATABASE_NAME, // nome do banco de dados
  waitForConnections: true, // mantém as conexões ativas
  connectionLimit: 10, // número máximo de conexões
  queueLimit: 0,
});

async function getConnection() {
  return pool.getConnection();
}

// Função para ler todos os registros
async function readAll(table, where = null) {
  const connection = await getConnection();
  try {
    let sql = `SELECT * FROM ${table}`;
    if (where) {
      sql += ` WHERE ${where}`;
    }

    const [rows] = await connection.execute(sql);
    return rows;
  } finally {
    connection.release();
  }
}

// Função para ler um registro específico
async function read(table, where) {
  const connection = await getConnection();
  try {
    let sql = `SELECT * FROM ${table}`;
    if (where) {
      sql += ` WHERE ${where}`;
    }

    const [rows] = await connection.execute(sql);
    return rows[0] || null;
  } finally {
    connection.release();
  }
}

// Função para inserir um novo registro
async function create(table, data) {
  const connection = await getConnection();
  try {
    const columns = Object.keys(data).join(', ');
    const placeholders = Array(Object.keys(data).length).fill('?').join(', ');
    const sql = `INSERT INTO ${table} (${columns}) VALUES (${placeholders})`;
    const values = Object.values(data);
    const [result] = await connection.execute(sql, values);
    return result.insertId;
  } finally {
    connection.release();
  }
}

// Função para atualizar um registro
async function update(table, data, where) {
  const connection = await getConnection();
  try {
    const set = Object.keys(data)
      .map((column) => `${column} = ?`)
      .join(', ');

    const sql = `UPDATE ${table} SET ${set} WHERE ${where}`;
    const values = Object.values(data);

    const [result] = await connection.execute(sql, [...values]);
    return result.affectedRows;
  } finally {
    connection.release();
  }
}

// Função para excluir um registro
async function deleteRecord(table, where) {
  const connection = await getConnection();
  try {
    const sql = `DELETE FROM ${table} WHERE ${where}`;
    const [result] = await connection.execute(sql);
    return result.affectedRows;
  } finally {
    connection.release();
  }
}

async function compare(senha, hash) {
  try {
    return await bcrypt.compare(senha, hash);
  } catch (error) {
    console.error('Erro ao comparar a senha com o hash:', error);
    return false;
  }
}

async function executeRawQuery(sql, values = []) {
  const connection = await getConnection();
  try {
    const [rows] = await connection.execute(sql, values);
    return rows;
  } finally {
    connection.release();
  }
}

export {
  create,
  readAll,
  read,
  update,
  deleteRecord,
  compare,
  executeRawQuery,
  getConnection,
};
