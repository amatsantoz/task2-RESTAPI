var express = require('express');
var router = express.Router();

const multer = require('multer');
var bcrypt = require('bcryptjs');
const db = require('../models');

const News = db.newss;
const Comment = db.comments;
const User = db.users;
const jwt = require('jsonwebtoken');
const config = require('../config');
const passport = require('passport');

const storageEngine = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, './public/images')
  },
  filename: (req, file, callback) => {
    callback(null, file.originalname)
  }
})

const upload = multer({ storage: storageEngine })


router.get('/', function (req, res, next) {
  News.findAll()
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.json({
        info: "Error",
        message: err.message
      });
    });
});

router.post('/add', upload.single('gambar'),
  passport.authenticate("jwt", { session: false }),
  function (req, res, next) {
    filegambar = req.file.destination + '/' + req.file.filename;
    var news = {
      judul: req.body.judul,
      category: req.body.category,
      gambar: filegambar,
      desc: req.body.desc
    }
    News.create(news)
      .then(data => {
        res.send({
          judul: req.body.judul,
          category: req.body.category,
          gambar: req.body.gambar,
          desc: req.body.desc
        });
      })
      .catch(err => {
        res.json({
          info: "Error",
          message: err.message
        });
      });
  });

router.get('/detailnews/:id', function (req, res, next) {
  var id = parseInt(req.params.id);

  News.findByPk(id)
    .then(data => {
      if (data) {
        res.json({
          info: "Berhasil Menemukan Berita dengan Id= " + id,
          berita: data
        });
      } else {
        res.json({
          info: "Tidak Ada Berita Dengan Id= " + id,
          berita: data
        });
      }
    })
    .catch(err => {
      res.json({
        info: "Error",
        message: err.message
      });
    });
});


router.put('/ubah/:id',
  passport.authenticate("jwt", { session: false }),
  upload.single('gambar'),
  function (req, res, next) {
    filegambar = req.file.destination + '/' + req.file.filename;
    var id = parseInt(req.params.id);
    try {
      if (req.file == undefined) {
        return res.send(`You must select a file.`);
      }
      var news = {
        judul: req.body.judul,
        category: req.body.category,
        gambar: filegambar,
        desc: req.file.desc,
      }
      News.update(news, {
        where: { id: id }
      })
        .then(() => {
          res.json({
            info: "Berita Dengan Id= " + id + " Berhasil Diupdate",
            berita: news,
          });
        });
    } catch (error) {
      console.log(error);
      return res.send(`Error when trying upload images: ${error}`);
    }
  });


router.delete('/hapus/:id',
  passport.authenticate("jwt", { session: false }),
  function (req, res, next) {
    var id = parseInt(req.params.id);
    try {
      News.destroy({
        where: { id: id },
      })
        .then(() => {
          res.json({
            info: "Berita Dengan Id= " + id + " Berhasil Dihapus (Soft Delete)",
          });
        });
    } catch (err) {
      return res.send(`Error when trying to delete berita: ${error}`);
    };
  });

module.exports = router;