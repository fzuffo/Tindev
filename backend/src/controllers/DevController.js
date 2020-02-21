const axios = require("axios");
const Dev = require("../models/Dev");

module.exports = {
  async index(req, res) {
    const { user } = req.headers;

    const loggedDev = await Dev.findById(user);

    const users = await Dev.find({
      // filtro para verificar lista de usuarios conforme condiçoes abaixo
      $and: [
        { _id: { $ne: user } }, //ne = not equal, mostre todos os usuarios menos o que estou logando
        { _id: { $nin: loggedDev.likes } }, //nin = not in, mostre todos menos os que ja deu like
        { _id: { $nin: loggedDev.dislikes } } //nin = not in, mostre todos que nao estao nos dislikes
      ]
    });

    return res.json(users);
  },

  async store(req, res) {
    const { username } = req.body;

    const userExists = await Dev.findOne({ user: username });
    if (userExists) {
      return res.json(userExists);
    }

    const response = await axios.get(
      `https://api.github.com/users/${username}`
    ); //await

    const { name, bio, avatar_url: avatar } = response.data;

    const dev = await Dev.create({
      name,
      user: username,
      bio,
      avatar
    });
    return res.json(dev);
  }
};
