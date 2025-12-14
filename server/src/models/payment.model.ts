"use strict";
import { Model, DataTypes } from "sequelize";
import { IPaymentAttributes } from "../interfaces/types/models/payment.model.types";

module.exports = (sequelize: any) => {
  class Payment extends Model implements IPaymentAttributes {
    id!: string;
    orderId!: string;
    amount!: number;
    currency!: string;
    paymentMethod!: string;
    status!: 'pending' | 'completed' | 'failed' | 'refunded';
    transactionId?: string;
    stripePaymentIntentId?: string;
    stripeChargeId?: string;
    refundAmount?: number;
    refundReason?: string;

    static associate(models: any) {
      // One-to-one relationship with Order
      Payment.belongsTo(models.Order, { foreignKey: "orderId", as: "order" });
    }
  }

  Payment.init(
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
      amount: {
        type: DataTypes.FLOAT,
        allowNull: false,
        validate: {
          min: 0,
        },
      },
      currency: {
        type: DataTypes.STRING(3),
        allowNull: false,
        defaultValue: 'USD',
      },
      paymentMethod: {
        type: DataTypes.STRING(50),
        allowNull: false,
      },
      status: {
        type: DataTypes.ENUM('pending', 'completed', 'failed', 'refunded'),
        allowNull: false,
        defaultValue: 'pending',
      },
      transactionId: {
        type: DataTypes.STRING(200),
        allowNull: true,
      },
      stripePaymentIntentId: {
        type: DataTypes.STRING(200),
        allowNull: true,
      },
      stripeChargeId: {
        type: DataTypes.STRING(200),
        allowNull: true,
      },
      refundAmount: {
        type: DataTypes.FLOAT,
        allowNull: true,
        validate: {
          min: 0,
        },
      },
      refundReason: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: "Payment",
      tableName: "Payments",
      timestamps: true,
    }
  );

  return Payment;
};