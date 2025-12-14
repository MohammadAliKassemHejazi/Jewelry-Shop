"use strict";
import { Model, DataTypes } from "sequelize";
import { ICartItemAttributes } from "../interfaces/types/models/cartitem.model.types";

module.exports = (sequelize: any) => {
  class CartItem extends Model implements ICartItemAttributes {
    id!: string;
    cartId!: string;
    productId!: string;
    quantity!: number;
    price!: number;
    addedAt!: Date;

    static associate(models: any) {
      // Many-to-one relationship with Cart
      CartItem.belongsTo(models.Cart, { foreignKey: "cartId", as: "cart" });
      
      // Many-to-one relationship with Product
      CartItem.belongsTo(models.Product, { foreignKey: "productId", as: "product" });
    }
  }

  CartItem.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      cartId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: "Carts",
          key: "id",
        },
      },
      productId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: "Products",
          key: "id",
        },
      },
      quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1,
        validate: {
          min: 1,
        },
      },
      price: {
        type: DataTypes.FLOAT,
        allowNull: false,
        validate: {
          min: 0,
        },
      },
      addedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      sequelize,
      modelName: "CartItem",
      tableName: "CartItems",
      timestamps: true,
    }
  );

  return CartItem;
};