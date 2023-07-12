const router = require("express").Router();
const { User } = require("../models/user.js");
const { Song, validate } = require("../models/song.js");
const auth = require("../middleware/auth.js");
const admin = require("../middleware/admin.js");
const validObjectId = require("../middleware/validObjectId.js");

//route to create a song
router.post("/", admin, async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send({ message: error.details[0].message });
  const song = await Song(req.body).save();
  res.status(201).send({ data: song, message: "Song added" });
});

//route to add all songs
router.get("/", async (req, res) => {
  const songs = await Song.find();
  res.status(201).send({ data: songs });
});

//route to update dong
router.put("/:id", [admin, validObjectId], async (req, res) => {
  const song = await Song.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });
  res.status(200).send({ data: song, message: "Song updated" });
});

//route to delete song
router.delete("/:id", [admin, validObjectId], async (req, res) => {
  await Song.findByIdAndDelete(req.params.id);
  res.status(201).send({ message: "Song deleted" });
});

//roue to like song
router.put("/likes/:id", [validObjectId, auth], async (req, res) => {
  let resMessage = "";
  const song = await Song.findById(req.params.id);
  if (!song) return res.status(200).send({ message: "Song does not exist" });

  const user = await User.findById(req.params._id);
  const index = await User.likedSongs.indexOf(song._id);
  if (index === -1) {
    user.likedSongs.push(song._id);
    resMessage = "Added to your liked songs!";
  } else {
    user.likedSongs.splice(index, 1);
    resMessage = "Removed from your liked songs";
  }
  await user.save();
  res.status(200).send({ message: resMessage });
});

//route to get all liked songs
router.get("/likes", auth, async (req, res) => {
  const user = await User.findById(req.user._id);
  const song = await Song.find({ _id: user.likedSongs });
  res.status(200).send({ data: song });
});

module.exports = router;
