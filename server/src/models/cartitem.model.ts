"use strict";
import { Model, DataTypes } from "sequelize";

module.exports = (sequelize: any) => {
  class CartItem extends Model {
    id!: string;
    cartId!: string;
    productId!: string;
    quantity!: number;

    static associate(models: any) {
      CartItem.belongsTo(models.Cart, { foreignKey: 'cartId', as: 'cart' });
      CartItem.belongsTo(models.Product, { foreignKey: 'productId', as: 'product' });
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
      },
      productId: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1,
      },
    },
    {
      sequelize,
      modelName: "CartItem",
    }
  );

  return CartItem;
};
