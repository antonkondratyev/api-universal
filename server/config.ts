import * as dotenv from 'dotenv';
import { Dialect } from 'sequelize';

dotenv.config({ path: __dirname + '/.env' });

export let SERVER_PORT = Number(process.env.SERVER_PORT!);

export let DATABASE_URL = process.env.DATABASE_URL!;
export let DATABASE_DIALECT = process.env.DATABASE_DIALECT! as Dialect;
export let DATABASE_LOGGING = !!process.env.DATABASE_LOGGING!;

export let ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET!;
export let REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET!;
export let ACCESS_TOKEN_EXPIRES = process.env.ACCESS_TOKEN_EXPIRES!;
export let REFRESH_TOKEN_EXPIRES = process.env.REFRESH_TOKEN_EXPIRES!;
