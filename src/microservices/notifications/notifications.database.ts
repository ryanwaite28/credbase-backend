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
  DATE,
  NOW
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

export const UserNotification = <MyModelStatic> sequelize.define('UserNotification', {
  ...common_model_fields,

  for_user_id:               { type: INTEGER, allowNull: false },
  event:                     { type: STRING, allowNull: false, defaultValue: '' },
  from_model_type:           { type: STRING, allowNull: false, defaultValue: '' },
  from_model_id:             { type: INTEGER, allowNull: false, defaultValue: 0 },
  target_type:               { type: STRING, allowNull: false, defaultValue: '' },
  target_id:                 { type: INTEGER, allowNull: false, defaultValue: 0 },
  read:                      { type: BOOLEAN, allowNull: false, defaultValue: false },
}, common_model_options);

export const UserNotificationLastOpened = <MyModelStatic> sequelize.define('UserNotificationLastOpened', {
  ...common_model_fields,

  user_id:                   { type: INTEGER, allowNull: false },
  last_opened:               { type: DATE, allowNull: false, defaultValue: NOW },
}, common_model_options);




export const AuthorityNotification = <MyModelStatic> sequelize.define('AuthorityNotification', {
  ...common_model_fields,

  for_authority_id:          { type: INTEGER, allowNull: false },
  event:                     { type: STRING, allowNull: false, defaultValue: '' },
  from_model_type:           { type: STRING, allowNull: false, defaultValue: '' },
  from_model_id:             { type: INTEGER, allowNull: false, defaultValue: 0 },
  target_type:               { type: STRING, allowNull: false, defaultValue: '' },
  target_id:                 { type: INTEGER, allowNull: false, defaultValue: 0 },
  read:                      { type: BOOLEAN, allowNull: false, defaultValue: false },
}, common_model_options);

export const AuthorityNotificationLastOpened = <MyModelStatic> sequelize.define('AuthorityNotificationLastOpened', {
  ...common_model_fields,

  authority_id:              { type: INTEGER, allowNull: false },
  last_opened:               { type: DATE, allowNull: false, defaultValue: NOW },
}, common_model_options);





