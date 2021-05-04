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
      res.send("Sorry, no messages!");
    }
  });
});
app.get("/playprompts", (req, res) => {
  let prompts = [
    "Brew a pot of coffee or tea to share. The floor will thank you.",
    "Say hello to someone you recognize from Zoom but haven't met in person.",
    "Take five to stretch.",
    "Go for a walk around the floor.",
    "Try a new tool out from the shop.",
    "Check on the plants! Do they need water? Take care of them.",
    "Check if the vending machine is empty...",
    "Say hello to someone you've never met before. Tell them the snail sent you.",
    "Look for the snail around the floor. Move it to another location once you find it. ",
    "Look for the snail around the floor. Let it sit next to you for a while. It's been lonely out there in the bins.",
    "Look for the snail around the floor. Leave it next to someone with a note. You could make someone's day.",
    "Look for the snail around the floor. Leave it in someone's bin. It will find its way back.",
    "Look for the snail around the floor. Place it on an empty table.",
    "Look for the snail around the floor. Place it on an empty seat.",
    "Look for the snail around the floor. Place it next to a plant.",
  ];
  let prompt = prompts[Math.floor(Math.random() * prompts.length)];

  res.send(prompt);
});

//Server Listen on a Port
app.listen(process.env.PORT || 80, function () {
  console.log("listening on port 80!");
});
