import {
  common_model_fields,
  get_common_model_options,
  MyModelStatic
} from '@lib/shared';
import {
  Sequelize,
  STRING,
  INTEGER,
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




export const S3Files = <MyModelStatic> sequelize.define('common_s3files', {
  ...common_model_fields,

  model_type:          { type: STRING, allowNull: true }, // determines if post belongs to a particular model; default (null) is user
  model_id:            { type: INTEGER, allowNull: true },
  description:         { type: STRING(500), allowNull: false, defaultValue: '' },
  file_type:           { type: STRING(500), allowNull: false, defaultValue: '' },
  file_size:           { type: STRING(500), allowNull: false, defaultValue: '' },
  full_url:            { type: STRING(500), allowNull: false, defaultValue: '' },
  bucket:              { type: STRING, allowNull: false, defaultValue: '' },
  path_key:            { type: STRING, allowNull: false, defaultValue: '' },
}, common_model_options);

