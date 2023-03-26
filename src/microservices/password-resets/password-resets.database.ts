import {
  AppEnvironment,
  common_icon_wallpaper_fields,
  common_model_fields,
  get_common_model_options,
  MyModelStatic
} from '@lib/backend-shared';
import {
  Sequelize,
  DATE,
  BOOLEAN,
  STRING,
  SyncOptions,
  INTEGER,
} from 'sequelize';
import moment from 'moment';

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

export const password_resets_db_init = async () => {
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




const expireBy = (): Date => {
  return moment().add(1, 'hours').toDate();
};


/** Models */

export const UserPasswordReset = <MyModelStatic> sequelize.define('UserPasswordReset', {
  ...common_model_fields,

  user_id:                             { type: INTEGER, allowNull: false },
  user_email:                          { type: STRING, allowNull: false },
  expire_by:                           { type: DATE, allowNull: false, defaultValue: expireBy },
  used:                                { type: BOOLEAN, allowNull: false, defaultValue: false },

}, common_model_options);


export const AuthorityPasswordReset = <MyModelStatic> sequelize.define('AuthorityPasswordReset', {
  ...common_model_fields,

  authority_id:                        { type: INTEGER, allowNull: false },
  authority_email:                     { type: STRING, allowNull: false },
  expire_by:                           { type: DATE, allowNull: false, defaultValue: expireBy },
  used:                                { type: BOOLEAN, allowNull: false, defaultValue: false },

}, common_model_options);