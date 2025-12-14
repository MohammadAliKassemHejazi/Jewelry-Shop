"use strict";
import { Model, DataTypes } from "sequelize";
import { ITestimonialAttributes } from "../interfaces/types/models/testimonial.model.types";

module.exports = (sequelize: any) => {
  class Testimonial extends Model implements ITestimonialAttributes {
    id!: string;
    name!: string;
    text!: string;
    rating!: number;
    image?: string;
    location?: string;
    verified!: boolean;

    static associate(models: any) {
      // No associations for now, but could be linked to orders or users in the future
    }
  }

  Testimonial.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      text: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      rating: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          min: 1,
          max: 5,
        },
      },
      image: {
        type: DataTypes.STRING(500),
        allowNull: true,
      },
      location: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      verified: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
    },
    {
      sequelize,
      modelName: "Testimonial",
      tableName: "Testimonials",
      timestamps: true,
    }
  );

  return Testimonial;
};
