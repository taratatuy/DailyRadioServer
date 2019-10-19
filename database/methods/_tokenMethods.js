const models = require('../models');

async function SetRefreshToken(login, refreshToken) {
  const data = await models.tokens.updateOne(
    {
      login: login
    },
    {
      refreshToken: refreshToken
    },
    {
      upsert: true
    }
  );

  if (data.n == 0) {
    return false;
  } else {
    return true;
  }
}

async function GetRefreshToken(login) {
  const data = await models.tokens.findOne({
    login: login
  });

  if (data) return data.refreshToken;
  return false;
}

const methods = {
  SetRefreshToken,
  GetRefreshToken
};

module.exports = methods;
