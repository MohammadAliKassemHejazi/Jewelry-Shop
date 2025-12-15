import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

const dbConfig = {
  dialect: 'sqlite' as const,
  storage: './database.sqlite',
  logging: false,
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
};

console.log('🔧 Database config export:', dbConfig);

export default dbConfig;
