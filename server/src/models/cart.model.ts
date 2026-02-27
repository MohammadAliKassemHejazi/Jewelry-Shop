"use strict";
import { Model, DataTypes } from "sequelize";

module.exports = (sequelize: any) => {
  class Cart extends Model {
    id!: string;
    userId!: string;
    total!: number;
    itemCount!: number;

    static associate(models: any) {
      Cart.belongsTo(models.User, { foreignKey: 'userId', as: 'user' });
      Cart.hasMany(models.CartItem, { foreignKey: 'cartId', as: 'items', onDelete: 'CASCADE' });
    }
  }

  Cart.init(
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
      total: {
        type: DataTypes.FLOAT,
        allowNull: false,
        defaultValue: 0,
      },
      itemCount: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
    },
    {
      sequelize,
      modelName: "Cart",
    }
  );

  return Cart;
};
