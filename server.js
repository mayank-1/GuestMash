const express = require("express");
const exphbs = require("express-handlebars");
const multer = require("multer");
const fs = require("fs");
const path = require("path");

const PORT = process.env.PORT || 5050;

// Create an instance of userController
const userController = require("./routes/user");

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//Use Multer to save the photo in /public/photos
var storage = multer.diskStorage({
  filename: function(req, file, cb) {
    var firstName = req.body.fname;
    var lastName = req.body.lname;
    firstName.trim();
    lastName.trim();
    var fullname = firstName + "-" + lastName;
    var filename = fullname + "-" + Date.now() + "-" + file.originalname;
    cb(null, filename);
  },
  destination: function(req, file, cb) {
    cb(null, process.env.PWD + "public/photos");
  }
});
var upload = multer({ storage: storage });

// Access Static files in Public folder
app.use("/public", express.static("public"));

//Handlebar Configuration
app.engine("handlebars", exphbs());
app.set("view engine", "handlebars");

// Delete the content of photos directory on server reload
setInterval(() => {
  console.log("Deleting photos Directory contents every 15 minutes");
  resetPhotoDir();
}, 900000);
function resetPhotoDir() {
  const directory = "./public/photos";

  fs.readdir(directory, (err, files) => {
    if (err) throw err;

    for (const file of files) {
      fs.unlink(path.join(directory, file), err => {
        if (err) throw err;
      });
    }
  });
}

// Call the index handlebar which will render the form
app.get("/", (req, res) => {
  res.render("index");
});

// Handle the User register route
app.post("/user/register", upload.single("propic"), userController.register);

// Handle the View Guests route
app.get("/guests", userController.getGuests);

app.listen(PORT, () => {
  console.log(`Server Listening ${PORT}`);
});
