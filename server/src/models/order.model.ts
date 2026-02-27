"use strict";
import { Model, DataTypes } from "sequelize";

module.exports = (sequelize: any) => {
  class Order extends Model {
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
      Order.belongsTo(models.User, { foreignKey: 'userId', as: 'user' });
      Order.hasMany(models.OrderItem, { foreignKey: 'orderId', as: 'items', onDelete: 'CASCADE' });
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
      },
      customerName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      customerEmail: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      total: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
      status: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 'pending',
      },
      shippingAddress: {
        type: DataTypes.JSON,
        allowNull: false,
      },
      billingAddress: {
        type: DataTypes.JSON,
        allowNull: true,
      },
      paymentMethod: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      paymentStatus: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 'pending',
      },
      trackingNumber: {
        type: DataTypes.STRING,
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
    }
  );

  return Order;
};
