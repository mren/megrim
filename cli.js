#!/usr/bin/env node

const pg = require('pg');
const pgConnectionString = require('pg-connection-string');

const migrate = require('./migrate');

const databaseUrl = process.env.DATABASE_URL;
const isSync = process.argv[2] === '--sync';

if (!databaseUrl) {
  console.log('No DATABASE_URL found in environment.');
  process.exit(1);
}

const config = pgConnectionString.parse(databaseUrl);
const pool = new pg.Pool(config);

migrate('schema', pool, isSync)
  .then((result) => {
    console.log(result);
    return pool.end();
  })
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
