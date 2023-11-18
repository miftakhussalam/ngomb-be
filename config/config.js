require('dotenv').config();

const {
  POSTGRES_USER,
  POSTGRES_PASSWORD,
  POSTGRES_DB,
  POSTGRES_DB_TEST,
  POSTGRES_HOST,
  DIALECT,
} = process.env;
module.exports = {
  development: {
    username: POSTGRES_USER,
    password: POSTGRES_PASSWORD,
    database: POSTGRES_DB,
    host: POSTGRES_HOST,
    dialect: DIALECT,
  },
  test: {
    username: POSTGRES_USER,
    password: POSTGRES_PASSWORD,
    database: POSTGRES_DB_TEST,
    host: POSTGRES_HOST,
    dialect: DIALECT,
  },
  production: {
    use_env_variable: 'DATABASE_URL_ELEPHANTSQL',
    dialect: 'postgres',
    protocol: 'postgres',
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false,
      },
    },
  },
};
