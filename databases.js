/**
 * Created by soulike on 17-4-8.
 */
const soulikesite = {
    database: 'soulikesite',
    username: 'soulike',
    password: 'SoulikeZhou',
    host: 'localhost',
    port: 5432,
    dialect: 'postgres',
    pool: {
        max: 5,
        min: 0,
        idle: 30000
    }
};

const practice = {
    database: 'practice',
    username: 'soulike',
    password: 'SoulikeZhou',
    host: 'localhost',
    port: 5432,
    dialect: 'postgres',
    pool: {
        max: 5,
        min: 0,
        idle: 30000
    }
};

const databases = {soulikesite, practice};

module.exports = databases;