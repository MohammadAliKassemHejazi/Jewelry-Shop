"use strict";
import { Model, DataTypes } from "sequelize";

module.exports = (sequelize: any) => {
  class Newsletter extends Model {
    id!: string;
    email!: string;
    subscribed!: boolean;

    static associate(models: any) {
      // define association here
    }
  }

  Newsletter.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      subscribed: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
    },
    {
      sequelize,
      modelName: "Newsletter",
    }
  );

  return Newsletter;
};
