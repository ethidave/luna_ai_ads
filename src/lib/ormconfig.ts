import { DataSource } from 'typeorm';
import { User } from './entities/User';
import { Campaign } from './entities/Campaign';
import { Payment } from './entities/Payment';
import { AdCreative } from './entities/AdCreative';
import { Analytics } from './entities/Analytics';
import { Wallet } from './entities/Wallet';
import { Transaction } from './entities/Transaction';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  username: process.env.DB_USERNAME || 'taskmaster_user',
  password: process.env.DB_PASSWORD || 'password',
  database: process.env.DB_NAME || 'taskmaster_ai',
  synchronize: process.env.NODE_ENV === 'development',
  logging: process.env.NODE_ENV === 'development',
  entities: [User, Campaign, Payment, AdCreative, Analytics, Wallet, Transaction],
  // migrations: ['src/migrations/*.ts'],
  // subscribers: ['src/subscribers/*.ts'],
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
});

export default AppDataSource;



