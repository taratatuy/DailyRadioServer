const userMethods = require('./_userMethods');
const tokenMethods = require('./_tokenMethods');

module.exports = { ...userMethods, ...tokenMethods };
