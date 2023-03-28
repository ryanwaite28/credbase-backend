import {
  AppEnvironment,
  common_icon_wallpaper_fields,
  common_model_fields,
  get_common_model_options,
  MyModelStatic
} from '@lib/backend-shared';
import { COMMON_STATUSES } from '@lib/fullstack-shared';
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

export const clients_db_init = async () => {
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

export const Client = <MyModelStatic> sequelize.define('Client', {
  ...common_model_fields,

  user_id:                             { type: INTEGER, allowNull: false },
  authority_id:                        { type: INTEGER, allowNull: false },

}, {
  ...common_model_options,
  indexes: [{ unique: true, fields: ['user_id', 'authority_id'] }]
});


export const ClientRequest = <MyModelStatic> sequelize.define('ClientRequest', {
  ...common_model_fields,

  user_id:                             { type: INTEGER, allowNull: false },
  authority_id:                        { type: INTEGER, allowNull: false },
  requester:                           { type: STRING, allowNull: false },
  status:                              { type: STRING, allowNull: false, defaultValue: COMMON_STATUSES.PENDING },

}, {
  ...common_model_options,
  indexes: [{ unique: true, fields: ['user_id', 'authority_id', 'requester'] }]
});
