import dotenv from "dotenv";

dotenv.config();

export const env = {
  envType: process.env.ENV!,
  port: process.env.PORT || 3000,
  dbUrl: process.env.DATABASE_URL!,
  testdbUrl: process.env.DATABASE_URL_TEST!,
  pepper: process.env.PEPPER!,
  saltRounds: process.env.BCRYPT_SALT_ROUNDS!,
  tokenSecret: process.env.TOKEN_SECRET!,
};
