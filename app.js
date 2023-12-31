/*-----------------------------------------------------------------------------------------------------------------------------------*/
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require('lodash');

const mongoose = require("mongoose");


/*-----------------------------------------------------------------------------------------------------------------------------------*/

const homeStartingContent = "Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing.";
const aboutContent = "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent = "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));




/*----------------------MONGODB SetUp--------------------------------------------------------------------*/
mongoose.connect("mongodb://127.0.0.1:27017/blogDB");

//new schema for blog post 
const postSchema = new mongoose.Schema( {
      title: String,
      body: String
});

//model based on blogSchema
const Post = mongoose.model("Post",postSchema);


/*---------------------------------------------------------------------------------------------------------------------*/


//to catch the root route
app.get("/",function(req,res) {

  Post.find({})
      .then(function(foundPosts) {
        res.render("home" , {
          homeStartingContent : homeStartingContent,
          posts : foundPosts
        });
      })

  
});


//to catch the about route
app.get("/about",function(req,res) {
  res.render("about" , {
    aboutContent : aboutContent
  });
});


//to catch the contact route
app.get("/contact",function(req,res) {
  res.render("contact" , {
    contactContent : contactContent
  });
});


//to catch the compose route
app.get("/compose",function(req,res) {
  res.render("compose");
});



app.get("/posts/:postName",function(req,res) {
  const Heading = req.params.postName;
  Post.findOne({title:Heading})
      .then(function(foundPost) {
        if(foundPost) {
          res.render("post", {
            orgTitle : foundPost.title ,
            orgContent : foundPost.body
        });
        }
        else {
          res.redirect("/");
        }
      })
      .catch(function(err) {
        console.log(err);
      });
});


/*-------------------------------------POST Route dealing with compose feature---------------------------------------------------------------------------------------------*/
app.post('/compose', function(req, res) {
  const title = req.body.postTitle;
  Post.findOne({title:title})
      .then(function(foundPost) {
        if(!foundPost) {
          //create a new post
          const post = new Post ({
            title: title,
            body: req.body.postContent
             });
             //save the post and redirect to root
             post.save();
             res.redirect("/");
        } else {
            //post already exists update the post content
            foundPost.body = req.body.postContent;
            foundPost.save();
            res.redirect("/");
        }
      })
      .catch(function(err) {
        console.log(err);
      });
});


/*-----------------------------------------------------------------------------------------------------------------------------------*/




app.listen(3000, function() {
  console.log("Server started on port 3000");
});


/*-----------------------------------------------------------------------------------------------------------------------------------*/