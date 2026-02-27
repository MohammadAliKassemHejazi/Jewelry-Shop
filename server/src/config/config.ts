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
    username: process.env.DB_USERNAME || 'sqlite',
    password: process.env.DB_PASSWORD || 'sqlite',
    database: process.env.DB_DATABASE_DEVELOPMENT || 'database.sqlite',
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    dialect: 'sqlite',
    dialectOptions: process.env.NODE_ENV === 'production' ? {
      ssl: {
        require: true,
        rejectUnauthorized: false
      }
    } : {},
    logging: false,
    dbDevelopment: process.env.DB_DATABASE_DEVELOPMENT || 'database.sqlite',
    dbProduction: process.env.DB_DATABASE_PRODUCTION || 'database.sqlite',
    dbTest: process.env.DB_DATABASE_TEST || 'database.sqlite',
  },
};

export default config;
