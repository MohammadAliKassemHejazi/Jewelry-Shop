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
    username: process.env.DB_USERNAME || 'postgres',
    password: process.env.DB_PASSWORD || 'postgres',
    database: process.env.DB_DATABASE_DEVELOPMENT || 'database.postgres',
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    dialect: 'postgres',
    dialectOptions: process.env.NODE_ENV === 'production' ? {
      ssl: {
        require: true,
        rejectUnauthorized: false
      }
    } : {},
    logging: false,
    dbDevelopment: process.env.DB_DATABASE_DEVELOPMENT || 'database.postgres',
    dbProduction: process.env.DB_DATABASE_PRODUCTION || 'database.postgres',
    dbTest: process.env.DB_DATABASE_TEST || 'database.postgres',
  },
};

export default config;
