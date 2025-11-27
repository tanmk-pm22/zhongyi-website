import Database from 'better-sqlite3'
import path from 'path'
import fs from 'fs'

// 数据库文件路径
const dbDir = path.join(process.cwd(), 'data')
const dbPath = path.join(dbDir, 'patients.db')

// 确保数据文件夹存在
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true })
}

// 创建数据库连接
const db = new Database(dbPath)

// 创建患者表
db.exec(`
  CREATE TABLE IF NOT EXISTS patients (
    id TEXT PRIMARY KEY,
    fullName TEXT NOT NULL,
    gender TEXT NOT NULL,
    dateOfBirth TEXT NOT NULL,
    idType TEXT NOT NULL,
    idNumber TEXT NOT NULL,
    phone TEXT NOT NULL,
    email TEXT,
    address TEXT NOT NULL,
    city TEXT NOT NULL,
    state TEXT NOT NULL,
    postcode TEXT NOT NULL,
    country TEXT NOT NULL,
    emergencyContact TEXT,
    emergencyPhone TEXT,
    emergencyRelation TEXT,
    allergies TEXT,
    medicalHistory TEXT,
    currentMedications TEXT,
    createdAt TEXT NOT NULL,
    updatedAt TEXT NOT NULL
  )
`)

// 创建就诊记录表
db.exec(`
  CREATE TABLE IF NOT EXISTS medical_records (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    patientId TEXT NOT NULL,
    date TEXT NOT NULL,
    doctor TEXT NOT NULL,
    diagnosis TEXT NOT NULL,
    treatment TEXT,
    prescription TEXT,
    notes TEXT,
    createdAt TEXT NOT NULL,
    FOREIGN KEY (patientId) REFERENCES patients(id)
  )
`)

// 创建索引以提高查询性能
db.exec(`
  CREATE INDEX IF NOT EXISTS idx_patients_phone ON patients(phone);
  CREATE INDEX IF NOT EXISTS idx_patients_idNumber ON patients(idNumber);
  CREATE INDEX IF NOT EXISTS idx_medical_records_patientId ON medical_records(patientId);
`)

console.log('✅ 数据库初始化成功')

export default db
