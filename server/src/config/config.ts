import dotenv from "dotenv";
dotenv.config();

const config = {
  env: process.env.NODE_ENV || "development",
  port: process.env.PORT || 5300,
  webtoken: process.env.JWT_SECRET,
  Stripekey: process.env.Stripe_Key,
  stripeWebhookSecret: process.env.WebhookSecret,
  client: process.env.CLIENT_URL,
  paypal: {
    clientId: process.env.PAYPAL_CLIENT_ID,
    clientSecret: process.env.PAYPAL_CLIENT_SECRET,
    environment: process.env.PAYPAL_ENVIRONMENT || 'sandbox'
  },
  database: {
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE_DEVELOPMENT || 'database',
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT,
    dialect: process.env.DB_DIALECT || 'sqlite',
    storage: process.env.DB_STORAGE || './database.sqlite',
    dialectOptions: process.env.NODE_ENV === 'production' && process.env.DB_DIALECT === 'postgres' ? {
      ssl: {
        require: true,
        rejectUnauthorized: false
      }
    } : {},
    logging: false,
    dbDevelopment: process.env.DB_DATABASE_DEVELOPMENT || 'database',
    dbProduction: process.env.DB_DATABASE_PRODUCTION || 'database',
    dbTest: process.env.DB_DATABASE_TEST || 'database',
  },
};

export default config;
