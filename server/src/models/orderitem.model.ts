"use strict";
import { Model, DataTypes } from "sequelize";
import { IOrderItemAttributes } from "../interfaces/types/models/orderitem.model.types";

module.exports = (sequelize: any) => {
  class OrderItem extends Model implements IOrderItemAttributes {
    id!: string;
    orderId!: string;
    productId!: string;
    name!: string;
    quantity!: number;
    price!: number;
    image!: string;

    static associate(models: any) {
      // Many-to-one relationship with Order
      OrderItem.belongsTo(models.Order, { foreignKey: "orderId", as: "order" });
      
      // Many-to-one relationship with Product
      OrderItem.belongsTo(models.Product, { foreignKey: "productId", as: "product" });
    }
  }

  OrderItem.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      orderId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: "Orders",
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
      name: {
        type: DataTypes.STRING(200),
        allowNull: false,
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
      image: {
        type: DataTypes.STRING(500),
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "OrderItem",
      tableName: "OrderItems",
      timestamps: true,
    }
  );

  return OrderItem;
};