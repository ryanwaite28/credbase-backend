import {
  AppEnvironment,
  common_icon_wallpaper_fields,
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

console.log(`AppEnvironment.database.CONNECTION_STRING:`, AppEnvironment.database.CONNECTION_STRING);

if (!AppEnvironment.database.CONNECTION_STRING) {
  throw new Error(`"DATABASE_URL" not set in environment variables...`);
}

const sequelize = new Sequelize(AppEnvironment.database.CONNECTION_STRING, {
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

export const assets_db_init = async () => {
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

export const Asset = <MyModelStatic> sequelize.define('Asset', {
  ...common_model_fields,
  ...common_icon_wallpaper_fields,

  authority_id:                        { type: INTEGER, allowNull: false },
  
  name:                                { type: STRING, allowNull: false },
  description:                         { type: STRING, allowNull: false },
  multiple:                            { type: BOOLEAN, allowNull: false, defaultValue: true },
  active:                              { type: BOOLEAN, allowNull: false, defaultValue: true },

}, common_model_options);