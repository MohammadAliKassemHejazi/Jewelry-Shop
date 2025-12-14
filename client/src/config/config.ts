const config = {
  env: process.env.NODE_ENV || "development",
  apiUrl: process.env.NEXT_PUBLIC_API_URL || "http://localhost:5300",
  appUrl: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
};

export default config;
