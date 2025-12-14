"use strict";
import { Model, DataTypes } from "sequelize";
import { IOrderAttributes } from "../interfaces/types/models/order.model.types";

module.exports = (sequelize: any) => {
  class Order extends Model implements IOrderAttributes {
    id!: string;
    userId!: string;
    customerName!: string;
    customerEmail!: string;
    total!: number;
    status!: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
    shippingAddress!: any;
    billingAddress?: any;
    paymentMethod!: string;
    paymentStatus!: 'pending' | 'paid' | 'failed' | 'refunded';
    trackingNumber?: string;
    notes?: string;

    static associate(models: any) {
      // Many-to-one relationship with User
      Order.belongsTo(models.User, { foreignKey: "userId", as: "user" });
      
      // One-to-many relationship with OrderItem
      Order.hasMany(models.OrderItem, { foreignKey: "orderId", as: "items", onDelete: "CASCADE" });
      
      // One-to-one relationship with Payment
      Order.hasOne(models.Payment, { foreignKey: "orderId", as: "payment" });
    }
  }

  Order.init(
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
      customerName: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      customerEmail: {
        type: DataTypes.STRING(150),
        allowNull: false,
        validate: {
          isEmail: true,
        },
      },
      total: {
        type: DataTypes.FLOAT,
        allowNull: false,
        validate: {
          min: 0,
        },
      },
      status: {
        type: DataTypes.ENUM('pending', 'processing', 'shipped', 'delivered', 'cancelled'),
        allowNull: false,
        defaultValue: 'pending',
      },
      shippingAddress: {
        type: DataTypes.JSONB,
        allowNull: false,
      },
      billingAddress: {
        type: DataTypes.JSONB,
        allowNull: true,
      },
      paymentMethod: {
        type: DataTypes.STRING(50),
        allowNull: false,
      },
      paymentStatus: {
        type: DataTypes.ENUM('pending', 'paid', 'failed', 'refunded'),
        allowNull: false,
        defaultValue: 'pending',
      },
      trackingNumber: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      notes: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: "Order",
      tableName: "Orders",
      timestamps: true,
    }
  );

  return Order;
};