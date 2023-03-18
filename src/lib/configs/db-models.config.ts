import { InitOptions, Sequelize } from "sequelize/types";
import { INTEGER, STRING, JSON as JSON_TYPE, UUIDV1 } from "sequelize";



export const get_common_model_options: (sequelize: Sequelize) => InitOptions = (sequelize: Sequelize) => ({
  sequelize,
  paranoid: true,
  timestamps: true,
  freezeTableName: true,
  underscored: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  deletedAt: 'deleted_at',
});

export const common_model_fields = {
  id:           { type: INTEGER, primaryKey: true, autoIncrement: true },
  uuid:         { type: STRING, defaultValue: UUIDV1 },
  metadata:     { type: JSON_TYPE, allowNull: true },
};