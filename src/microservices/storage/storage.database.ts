import {
  AppEnvironment,
  common_model_fields,
  get_common_model_options,
  MyModelStatic
} from '@lib/backend-shared';
import {
  Sequelize,
  STRING,
  INTEGER,
  SyncOptions,
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

export const storage_db_init = async () => {
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




export const S3Object = <MyModelStatic> sequelize.define('S3Object', {
  ...common_model_fields,

  model_type:          { type: STRING, allowNull: true }, // determines if post belongs to a particular model; default (null) is user
  model_id:            { type: INTEGER, allowNull: true },

  name:                { type: STRING(500), allowNull: false, defaultValue: '' },
  description:         { type: STRING(500), allowNull: false, defaultValue: '' },
  extension:           { type: STRING(500), allowNull: false, defaultValue: '' },
  mimetype:            { type: STRING(500), allowNull: false, defaultValue: '' },
  size:                { type: INTEGER, allowNull: false, defaultValue: 0 },
  
  s3_url:              { type: STRING(500), allowNull: false, defaultValue: '' },
  bucket:              { type: STRING, allowNull: false },
  path_key:            { type: STRING, allowNull: false },
}, {
  ...common_model_options,
  indexes: [{ unique: true, fields: ['bucket', 'path_key'] }]
});

