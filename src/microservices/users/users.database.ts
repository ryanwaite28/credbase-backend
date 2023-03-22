import {
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
} from 'sequelize';

const { DATABASE_URL } = process.env;
console.log(`DATABASE_URL:`, DATABASE_URL);

if (!DATABASE_URL) {
  throw new Error(`"DATABASE_URL" not set in environment variables...`);
}

const sequelize = new Sequelize(DATABASE_URL, {
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

export const users_db_init = async () => {
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

export const User = <MyModelStatic> sequelize.define('User', {
  ...common_model_fields,
  ...common_icon_wallpaper_fields,

  firstname:                           { type: STRING, allowNull: false },
  lastname:                            { type: STRING, allowNull: false },
  email:                               { type: STRING, allowNull: false },
  password:                            { type: STRING, allowNull: false },
  
  phone:                               { type: STRING, allowNull: true, defaultValue: null },
  temp_phone:                          { type: STRING, allowNull: true, defaultValue: null },

  person_verified:                     { type: BOOLEAN, allowNull: false, defaultValue: false },
  email_verified:                      { type: BOOLEAN, allowNull: false, defaultValue: false },
  phone_verified:                      { type: BOOLEAN, allowNull: false, defaultValue: false },
}, common_model_options);