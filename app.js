const express= require('express')
require('dotenv').config()
const bodyParser = require('body-parser')
const ejs = require('ejs');
const mongoose = require('mongoose');
const md5 = require('md5');

const app = express();

app.use(express.static('public'));

mongoose.connect("mongodb://localhost:27017/userDB" , {useNewUrlParser: true});

const userSchema = new mongoose.Schema({
    email: String,
    password: String
});


const user = new mongoose.model("User", userSchema);

app.use(bodyParser.urlencoded({
    extended: true
}));
app.set('view engine', 'ejs');


app.get("/",function(req, res) {
    res.render('home')
})

app.get("/login" ,function(req, res) {
    res.render('login')
})

app.get("/register" ,function(req, res) {
    res.render('register')
})

app.post("/register", function(req, res) {
    const newUser = new user({
        email: req.body.username,
        password: md5(req.body.password)
    })
    newUser.save()
    if(newUser) res.render('secrets')    
    else return
});

app.post("/login" ,async (req ,res)=>{
    const username = await req.body.username;
    const password = await md5(req.body.password);

    await user.findOne({email : username})
    .then((user)=>{
        if(user.password === password){
            res.render('secrets')
        }
    }
    ).catch((err)=>{
        if(err){
        res.status(500).render({message: err.message})
    }})
})
               

        



app.listen(3000, function(){
    console.log(`Server started on http://localhost:${process.env.PORT}`);
})