const express = require("express");
const bodyParser = require("body-parser");
const ejs = require('ejs');
const encrypt= require("mongoose-encryption")

const mongoose = require("mongoose");
mongoose.connect("mongodb://localhost:27017/blogwebsite", { useNewUrlParser: true })



const app = express();
app.use(bodyParser.urlencoded({ extended: true }))
app.use(express.static("public"));
app.set('view engine', "ejs")



const schema = new mongoose.Schema( {

    Username: String,
    Password: String
})
const secret= "ThisIsOurSecret";
schema.plugin(encrypt, {secret: secret, encryptedFields: ["Password"]});

const User = new mongoose.model("User", schema)

app.get('/', (req, res) => {

    res.render("home")
})

app.get('/login', (req, res) => {

    res.render("login")
})

app.post("/login", (req, res) => {

    const name = req.body.Username
    const pass = req.body.Password

    User.findOne({ Username: name }, (err, data) => {

        if (err) {
            console.log(err);

        } else {
            if (data) {
                if (data.Password === pass) {
                    res.render("secret");
                }
            }
        }
    })
})

app.get('/register', (req, res) => {

    res.render("register")
})


app.post("/register", (req, res) => {

    const newUser = new User({

        Username: req.body.Username,
        Password: req.body.Password

    })
    newUser.save((err) => {
        if (err) {
            console.log(err);

        } else {
            res.render("secret")
        }
    })
})



app.listen(3000, () => {

    console.log("the server is running on 3000 port");

})











