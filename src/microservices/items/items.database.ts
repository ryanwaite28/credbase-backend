import {
  AppEnvironment,
  common_model_fields,
  get_common_model_options,
  MyModelStatic
} from '@lib/backend-shared';
import {
  Sequelize,
  STRING,
  BOOLEAN,
  SyncOptions,
  INTEGER,
} from 'sequelize';

console.log(`AppEnvironment.database.URL:`, AppEnvironment.database.URL);

if (!AppEnvironment.database.URL) {
  throw new Error(`"URL" not set in environment variables...`);
}

const sequelize = new Sequelize(AppEnvironment.database.URL, {
  logging: false,
  dialect: 'postgres',
  dialectOptions: {
    // ssl: {
    //   require: false,
    //   rejectUnauthorized: false
    // }
  }
});


const common_model_options = get_common_model_options(sequelize);





/** Init Database */

export const items_db_init = async () => {
  const sequelize_db_sync_options: SyncOptions = {
    force: false,
    alter: false,
  };
  
  console.log({
    sequelize_db_sync_options,
  });

  // await sequelize.drop();

  return sequelize.sync(sequelize_db_sync_options)
    .then(() => {
      console.log('\n\nDatabase Initialized!');
    })
    .catch((error) => {
      console.log('\n\nDatabase Failed!', error);
      throw error;
    });
};





/** Models */

export const Item = <MyModelStatic> sequelize.define('Item', {
  ...common_model_fields,

  client_id:                           { type: INTEGER, allowNull: false },
  asset_id:                            { type: INTEGER, allowNull: false },
  
  title:                               { type: STRING, allowNull: false },
  description:                         { type: STRING, allowNull: false },
  active:                              { type: BOOLEAN, allowNull: false, defaultValue: true },

}, common_model_options);

export const ItemField = <MyModelStatic> sequelize.define('ItemField', {
  ...common_model_fields,

  item_id:                            { type: INTEGER, allowNull: false, references: { model: Item, key: 'id' } }, 
  parent_field_id:                    { type: INTEGER, allowNull: true, references: { model: 'ItemField', key: 'id' } },
  has_children:                       { type: BOOLEAN, allowNull: false, defaultValue: false },
  
  key:                                { type: STRING, allowNull: true },
  name:                               { type: STRING, allowNull: false },
  value:                              { type: STRING, allowNull: false },
  type:                               { type: STRING, allowNull: true },

}, common_model_options);


Item.hasMany(ItemField, { as: 'fields', foreignKey: 'item_id', sourceKey: 'id' });
ItemField.belongsTo(Item, { as: 'item', foreignKey: 'item_id', targetKey: 'id' });

ItemField.hasMany(ItemField, { as: 'fields', foreignKey: 'parent_field_id', sourceKey: 'id' });
ItemField.belongsTo(ItemField, { as: 'parent', foreignKey: 'parent_field_id', targetKey: 'id' });