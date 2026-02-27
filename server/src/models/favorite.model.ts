"use strict";
import { Model, DataTypes } from "sequelize";

module.exports = (sequelize: any) => {
  class Favorite extends Model {
    id!: string;
    userId!: string;
    productId!: string;

    static associate(models: any) {
      Favorite.belongsTo(models.User, { foreignKey: 'userId', as: 'user' });
      Favorite.belongsTo(models.Product, { foreignKey: 'productId', as: 'product' });
    }
  }

  Favorite.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      userId: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      productId: {
        type: DataTypes.UUID,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "Favorite",
    }
  );

  return Favorite;
};
