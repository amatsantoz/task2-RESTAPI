var express = require('express');
var router = express.Router();

const db = require('../models');
const User = db.users;
const News = db.newss;
const Comment = db.comments;
const Op = db.Sequelize.Op;

// Create (Post) Sebuah Komentar
// POST
router.post('/tambah/:id', function (req, res, next) {
  // Params id disini adalah id berita yang memiliki komentar tersebut
  var id = parseInt(req.params.id);

  try {
    var komen = {
      description: req.body.description,
      newsId: id
    }

    Comment.create(komen)
      .then(() => {
        res.json({
          info: "Komentar Berhasil Ditambahkan ke Berita dengan Id " + id,
          komentar: komen
        });
      });

  } catch (error) {
    console.log(error);
    return res.send(`Error: ${error}`);
  }
});


module.exports = router;