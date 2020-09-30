//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const _ = require("lodash");

const homeStartingContent = "Hello People over the internet! This is a Daily Journal Blog Web Application. Here, you can write your daily experiences, daily Journals , dialy Blogs. This space lets you express yourself yourway! You can dive deep here in the world of writing where you can write your heart out. This place lets you connect with fellow readers and writers from across the world. So, let your thoughts and ideas go wild here and Happy Writing!";

const aboutContent = "Daily journal is blogging site where you can post your blogs publicly for the world to see. What makes it different from most other blogging sites though, is that apart from posting public blogs you can use it as a personal diary as well. Yes you read it right! All you need to do is select your posts to be private while creating them and voila! You have a personal journal entry! Hope you have a good time on Daily Journal.";

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.connect("mongodb+srv://admin-sanrocks:mcgregor@cluster0.bu0li.mongodb.net/blogDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const postSchema = {
  title: String,
  content: String
};

const Post = mongoose.model("Post", postSchema);

app.get("/", function(req, res){

  Post.find({}, function(err, posts){
    res.render("home", {
      startingContent: homeStartingContent,
      posts: posts
      });
  });
 
});


app.get("/compose", function(req, res){
  res.render("compose");
});

app.post("/compose", function(req, res){

  const post = new Post ({
    title: req.body.postTitle,
    content: req.body.postBody
  });

  post.save(function(err){
    if(!err){
      res.redirect("/");
    }
  });
  // res.redirect("/");
});

app.get("/posts/:postId", function(req, res){
 // const requestedTitle = _.lowerCase(req.params.postName);

const requestedPostId = req.params.postId;

  Post.findOne({_id: requestedPostId}, function(err,post){
    res.render("post", {
      title: post.title,
      content: post.content
    });
  });

  // posts.forEach(function(post){
  //   const storedTitle = _.lowerCase(post.title);

  //   if (storedTitle === requestedTitle) {
  //     res.render("post", {
  //       title: post.title,
  //       content: post.content
  //     });
  //   }
  // });

});

app.get("/about", function(req, res){
  res.render("about", {aboutContent: aboutContent});
});

app.get("/contact", function(req, res){
  res.render("contact", {contactContent: contactContent});
});

let port = process.env.PORT;
if(port == null || port == ""){
  port = 3000;
}

app.listen(port, function() {
  console.log("Server has started successfully.");
});
