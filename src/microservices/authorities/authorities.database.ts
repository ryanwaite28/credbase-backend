import {
  common_model_fields,
  get_common_model_options,
  MyModelStatic
} from '@lib/shared';
import {
  Sequelize,
  STRING,
  BOOLEAN,
  SyncOptions,
  INTEGER,
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

export const authorities_db_init = async () => {
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

export const Authority = <MyModelStatic> sequelize.define('Authority', {
  ...common_model_fields,

  email:                               { type: STRING, unique: true, allowNull: false },
  password:                            { type: STRING, allowNull: false },
  
  name:                                { type: STRING, allowNull: false },
  description:                         { type: STRING, allowNull: false },
  support_email:                       { type: STRING, allowNull: true },
  business_website:                    { type: STRING, allowNull: true },
  support_website:                     { type: STRING, allowNull: true },

  street_address:                      { type: STRING, allowNull: true },
  city:                                { type: STRING, allowNull: true },
  state:                               { type: STRING, allowNull: true },
  country:                             { type: STRING, allowNull: true },
  zipcode:                             { type: INTEGER, allowNull: true },
  
  phone:                               { type: STRING, allowNull: true, defaultValue: null },
  temp_phone:                          { type: STRING, allowNull: true, defaultValue: null },

  icon_link:                           { type: STRING, allowNull: true, defaultValue: '' },
  icon_id:                             { type: STRING, allowNull: true, defaultValue: '' },
  wallpaper_link:                      { type: STRING, allowNull: true, defaultValue: '' },
  wallpaper_id:                        { type: STRING, allowNull: true, defaultValue: '' },

  account_verified:                    { type: BOOLEAN, allowNull: false, defaultValue: false },
  email_verified:                      { type: BOOLEAN, allowNull: false, defaultValue: false },
  phone_verified:                      { type: BOOLEAN, allowNull: false, defaultValue: false },
}, common_model_options);