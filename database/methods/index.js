const userMethods = require('./_userMethods');
const tokenMethods = require('./_tokenMethods');
const favoriteMethods = require('./_favoriteMethods');

module.exports = { ...userMethods, ...tokenMethods, ...favoriteMethods };
