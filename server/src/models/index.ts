// src/models/index.ts
"use strict";

import fs from "fs";
import path from "path";
import { Sequelize, DataTypes } from "sequelize";
import dbConfig from "../config/db.config";

const basename = path.basename(__filename);

console.log("🔧 Database config:", dbConfig);

const db: any = {};
let sequelize: any;

try {
  // Directly pass the config object
  const config = dbConfig as any;
  sequelize = new Sequelize({
    dialect: config.dialect,
    storage: config.storage,
    logging: config.logging,
    pool: config.pool
  });
} catch (error) {
  console.error("❌ Failed to initialize Sequelize:", error);
  throw error;
}

// Test the connection
sequelize.authenticate()
  .then(() => {
    console.log("✅ Database connection established successfully.");
  })
  .catch((err: any) => {
    console.error("❌ Unable to connect to the database:", err);
  });

// Load models
const modelFiles = fs.readdirSync(__dirname)
  .filter((file: string) => {
    return (
      file.indexOf(".") !== 0 && 
      file !== basename && 
      (file.slice(-3) === ".ts" || file.slice(-3) === ".js") &&
      file !== "index.ts" &&
      file !== "index.js"
    );
  });

console.log(`📁 Loading ${modelFiles.length} model files:`, modelFiles);

modelFiles.forEach((file: string) => {
  try {
    const model = require(path.join(__dirname, file))(
      sequelize,
      DataTypes
    );
    db[model.name] = model;
    console.log(`✅ Loaded model: ${model.name}`);
  } catch (error) {
    console.error(`❌ Failed to load model from file: ${file}`, error);
  }
});

// Set up associations
Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    try {
      db[modelName].associate(db);
      console.log(`🔗 Set up associations for: ${modelName}`);
    } catch (error) {
      console.error(`❌ Failed to set up associations for: ${modelName}`, error);
    }
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

console.log(`🎉 Database initialization complete. Models loaded: ${Object.keys(db).filter(key => key !== 'sequelize' && key !== 'Sequelize').join(', ')}`);

export default db;
