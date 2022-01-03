const { port } = require('pg/lib/defaults');
const {Sequelize} = require('sequelize');

module.exports = new Sequelize(
    'root', 
    'root',
    'root',
    {
        host: '35.184.52.196',
        port: '5432',
        dialect: 'postgres'
    }
)
