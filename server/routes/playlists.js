const router = require("express").Router();
const { Playlist, validate } = require("../models/playlist.js");
const { Song, validate } = require("../models/song.js");
const { User, validate } = require("../models/user.js");
const auth = require("../middleware/auth.js");
const admin = require("../middleware/admin.js");
const validObjectId = require("../middleware/validObjectId.js");
const Joi = require("joi");

//create a playlist
router.post("/", auth, async (req, res) => {
  const { error } = validate(req.body);
  if (error) res.status(400).send({ message: error.details[0].message });
  const user = await User.findById(req.user._id);
  const playlist = await Playlist.findById({
    ...req.body,
    user: user._id,
  }).save();
  user.playlists.push(playlist._id);
  await user.save();
  res.status(200).send({ data: playlist });
});

// edit playlist by id
router.put("/edit/:id", [validateObjectId, auth], async (req, res) => {
  const schema = Joi.object({
    name: Joi.string().required(),
    desc: Joi.string().allow(""),
    img: Joi.string().allow(""),
  });
  const { error } = schema.validate(req.body);
  if (error) return res.status(400).send({ message: error.details[0].message });

  const playlist = await Playlist.findById(req.params.id);
  if (!playlist) return res.status(404).send({ message: "Playlist not found" });

  const user = await User.findById(req.user._id);
  if (!user._id.equals(playlist.user))
    return res.status(403).send({ message: "User don't have access to edit!" });

  playlist.name = req.body.name;
  playlist.desc = req.body.desc;
  playlist.img = req.body.img;
  await playlist.save();

  res.status(200).send({ message: "Updated successfully" });
});

module.exports = router;
