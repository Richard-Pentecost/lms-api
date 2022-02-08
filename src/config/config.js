require('dotenv').config();

module.exports = {
  development: {
    username: process.env.DB_USERNAME || 'postgres',
    password: process.env.DB_PASSWORD || 'postgres',
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT) || 5432,
    database: process.env.DB_DATABASE || 'lms-dev-db',
    dialect: 'postgres',
    logging: false,
  },
  test: {
    username: process.env.DB_TEST_USERNAME || 'postgres',
    password: process.env.DB_TEST_PASSWORD || 'postgres',
    host: process.env.DB_TEST_HOST || 'localhost',
    port: parseInt(process.env.DB_TEST_PORT) || 5433,
    database: process.env.DB_TEST_DATABASE || 'lms-test-db',
    dialect: 'postgres',
    logging: false,
  },
  production: {
    use_env_variable: process.env.DATABASE_URL,
    dialect: 'postgres',
  }
}
  
