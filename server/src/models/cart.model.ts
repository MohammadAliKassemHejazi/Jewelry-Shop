"use strict";
import { Model, DataTypes } from "sequelize";
import { ICartAttributes } from "../interfaces/types/models/cart.model.types";

module.exports = (sequelize: any) => {
  class Cart extends Model implements ICartAttributes {
    id!: string;
    userId!: string;
    total!: number;
    itemCount!: number;

    static associate(models: any) {
      // One-to-one relationship with User
      Cart.belongsTo(models.User, { foreignKey: "userId", as: "user" });
      
      // One-to-many relationship with CartItem
      Cart.hasMany(models.CartItem, { foreignKey: "cartId", as: "items", onDelete: "CASCADE" });
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
        references: {
          model: "Users",
          key: "id",
        },
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
      tableName: "Carts",
      timestamps: true,
    }
  );

  return Cart;
};
