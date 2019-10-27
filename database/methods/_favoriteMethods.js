const models = require('../models');

async function AddFavorite(login, song) {
  let favoriteSongs = await GetFavorites(login);

  if (favoriteSongs.includes(song)) return true;
  favoriteSongs.unshift(song);

  return await UpdFavorites(login, favoriteSongs);
}

async function DelFavorite(login, song) {
  let previousSongs = await GetFavorites(login);

  if (!previousSongs[0]) return false;

  let newSongsList = previousSongs.filter(previousSong => {
    return previousSong != song;
  });

  return await UpdFavorites(login, newSongsList);
}

async function UpdFavorites(login, newSongsList) {
  let upd = await models.favorites.updateOne(
    {
      login: login
    },
    {
      songs: newSongsList
    },
    {
      upsert: true
    }
  );

  if (upd.n == 0) return false;
  return true;
}

async function GetFavorites(login) {
  let data = await models.favorites.findOne({
    login: login
  });

  if (data) return Array.from(data.songs);
  console.log('data', data);
  return [];
}

const methods = {
  AddFavorite,
  DelFavorite,
  GetFavorites
};

module.exports = methods;
