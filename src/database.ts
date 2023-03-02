import dotenv from 'dotenv';
import {Pool, PoolConfig} from 'pg';


dotenv.config();

const poolConfig: PoolConfig = {
  host: process.env.POSTGRES_HOST!,
  user: process.env.POSTGRES_USER!,
  password: process.env.POSTGRES_PASSWORD!,
  database: process.env.NODE_ENV === 'test' ? process.env.POSTGRES_TEST_DB : process.env.POSTGRES_DB,
};

const client = new Pool(poolConfig);

export default client;