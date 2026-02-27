"use strict";
import { Model, DataTypes } from "sequelize";

module.exports = (sequelize: any) => {
  class Article extends Model {
    id!: string;
    title!: string;
    text!: string;
    excerpt?: string;
    authorId!: string;
    category?: string;
    tags?: string;
    featuredImage?: string;
    published!: boolean;
    publishedAt?: Date;
    viewCount!: number;
    likeCount!: number;

    static associate(models: any) {
      Article.belongsTo(models.User, { foreignKey: 'authorId', as: 'author' });
    }
  }

  Article.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      text: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      excerpt: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      authorId: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      category: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      tags: {
        type: DataTypes.JSON, // Changed from STRING to JSON to match front-end array of strings
        allowNull: true,
      },
      featuredImage: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      published: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      publishedAt: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      viewCount: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      likeCount: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
    },
    {
      sequelize,
      modelName: "Article",
    }
  );

  return Article;
};
