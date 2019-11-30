const fs = require("fs");
var path = require("path");

const userController = {};
var finalGuest = [];

userController.register = function(req, res) {
  var fname = req.body.fname;
  var lname = req.body.lname;
  var profilePhotoURL = req.file.path;

  if (fname && lname && profilePhotoURL) {
    return res.redirect("/");
  }

  return res.status(500).send({ status: "Registration Failed!" });
};

userController.getGuests = function(req, res) {
  finalGuest = [];

  // Access Public folder
  var filesPath = path.resolve("public/photos");
  var files = fs.readdirSync(filesPath);

  // Now we will create registered guests Object having multiple guest details
  if (!files) {
    return res.status(500).render("guests", { data: "No Guests Registered" });
  }
  for (var i in files) {
    formatGuestObject(files[i]);
  }

  return res.render("guests", { guest: finalGuest });
};

function formatGuestObject(file) {
  var imagePath = "/public/photos/" + file;
  var splitImageFileName = file.split("-");
  var guestName = splitImageFileName[0] + " " + splitImageFileName[1];
  var data = { name: guestName, profile: imagePath };
  finalGuest.push(data);
}

module.exports = userController;
