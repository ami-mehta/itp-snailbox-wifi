//Instantiate nedb Database
var datastore = require("nedb"),
  db = new datastore({ filename: "database.json", autoload: true });

//Instantiate App and Express
var express = require("express");
var bodyParser = require("body-parser");
var app = express();
var path = require("path");
const { response } = require("express");

//Instantiate BodyParser
var urlencodedBodyParser = bodyParser.urlencoded({ extended: true });
app.use(urlencodedBodyParser);

//Public Folder
app.use(express.static("public"));

//EJS Template
app.set("view engine", "ejs");

//Click Get Started -> Leave Messages
app.get("/messages", (req, res) =>
  res.sendFile(__dirname + "/views/messages.html")
);

//Submit Message -> Confirmation Page
app.post("/confirmation", (req, res) => {
  //Data Object
  db.find({}, (err, profiles) => {
    const dataToSave = {
      message: req.body.q1,
      timeStamp: Date.now(),
    };

    //nedb Database
    db.insert(dataToSave, function (err, newMessage) {
      res.render("confirmation", { message: newMessage });
    });
  });
});

app.get("/status", (req, res) => {
  db.find({}, function (err, messages) {
    console.log(messages);
    res.render("status", { data: messages });
  });
});
app.get("/checkmessage", (req, res) => {
  db.find({}, function (err, messages) {
    console.log(messages);
    if (messages.length > 0) {
      messages.sort(function (a, b) {
        return a.timeStamp + b.timeStamp;
      });
      res.send(messages[0].message);
      db.remove({ _id: messages[0]._id }, {}, function (err, numRemoved) {
        // numRemoved = 1
      });
    } else {
      res.send("No messages!");
    }
  });
});

//Server Listen on a Port
app.listen(process.env.PORT || 80, function () {
  console.log("listening on port 80!");
});
