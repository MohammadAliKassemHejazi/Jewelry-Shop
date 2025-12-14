"use strict";

import { Model, UUIDV4, DataTypes, ForeignKey, Sequelize } from "sequelize";
import { IProductAttributes } from "../interfaces/types/models/product.model.types";

module.exports = (sequelize: Sequelize) => {
  class Product extends Model<IProductAttributes> implements IProductAttributes {
    id!: string;
    name!: string;
    description!: string;
    price!: number;
    stock!: number;
    image?: string;
    images?: string[];
    sku?: string;
    weight?: number;
    dimensions?: {
      length: number;
      width: number;
      height: number;
    };
    materials?: string[];
    gemstones?: string[];
    featured?: boolean;
    onSale?: boolean;
    salePrice?: number;
    rating?: number;
    reviewCount?: number;
    isActive?: boolean;
    metaTitle?: string;
    metaDescription?: string;
    slug?: string;
    tags?: string;
    discount?: number;

    static associate(models: any) {
      Product.belongsTo(models.User, { foreignKey: 'ownerId', targetKey: 'id', onDelete: 'CASCADE' });
      Product.belongsTo(models.Category, { foreignKey: 'categoryId', targetKey: 'id', onDelete: 'CASCADE' });
      Product.belongsTo(models.SubCategory, { foreignKey: 'subcategoryId', targetKey: 'id', onDelete: 'CASCADE' });
      Product.belongsTo(models.Store, { foreignKey: 'storeId', targetKey: 'id', onDelete: 'CASCADE' });

      Product.hasMany(models.ProductImage, { foreignKey: 'productId', onDelete: 'CASCADE' });
      Product.hasMany(models.CartItem, { foreignKey: 'productId', onDelete: 'CASCADE' });
      Product.hasMany(models.Favorite, { foreignKey: 'productId', onDelete: 'CASCADE' });
      Product.hasMany(models.OrderItem, { foreignKey: 'productId'});
      Product.hasMany(models.Comment, { foreignKey: 'productId', onDelete: 'CASCADE' });
      Product.hasMany(models.SizeItem, { foreignKey: 'productId', onDelete: 'CASCADE' });
    }
  }

  Product.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: UUIDV4,
      allowNull: false,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    price: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    stock: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    image: {
      type: DataTypes.STRING(500),
      allowNull: true,
    },
    images: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: true,
    },
    sku: {
      type: DataTypes.STRING(100),
      allowNull: true,
      unique: true,
    },
    weight: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    dimensions: {
      type: DataTypes.JSONB,
      allowNull: true,
    },
    materials: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: true,
    },
    gemstones: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: true,
    },
    featured: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    onSale: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    salePrice: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    rating: {
      type: DataTypes.FLOAT,
      allowNull: true,
      defaultValue: 0,
    },
    reviewCount: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0,
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    ownerId: {
      type: DataTypes.UUID,
      allowNull: false,
      field: 'ownerId',  // Explicit field name
    },
    categoryId: {
      type: DataTypes.UUID,
      allowNull: false,
      field: 'categoryId',  // Explicit field name
    },
    subcategoryId: {
      type: DataTypes.UUID,
      allowNull: true,
      field: 'subcategoryId',  // Explicit field name
    },
    storeId: {
      type: DataTypes.UUID,
      allowNull: false,
      field: 'storeId',  // Explicit field name
    },
    metaTitle: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    metaDescription: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    slug: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    tags: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    discount: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    
  }, {
    sequelize,
    modelName: "Product",
    tableName: "Products", // Ensure the table name is consistent
    timestamps: true, // If you want timestamps like createdAt and updatedAt
  });

  return Product;
};
