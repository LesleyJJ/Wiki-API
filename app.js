//jshint esversion:6
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");

const app = express();
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/wikiDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true
});
const articleSchema = {
  title: String,
  content: String
};

const Article = mongoose.model("Article", articleSchema);

app.route("/article").get(function(req, res) {
  Article.find(function(err, foundItems) {
    if (!err) {
      res.send(foundItems);
    } else {
      console.log(err);
    }
  });
}).post(function(req, res) {

  const newArticle = new Article({
    title: req.body.title,
    content: req.body.content
  });
  newArticle.save(function(err) {
    if (!err) {
      console.log("Successfully inserted an article");
    } else {
      console.log(err);
    }
  });
}).delete(function(req, res) {
  Article.deleteMany(function(err) {
    if (!err) {
      console.log("Successfully deleted all articles!!");
    } else {
      console.log(err);
    }
  });
});

app.route("/article/:articleTitle")
.get(function(req, res){
  Article.findOne({title: req.params.articleTitle}, function(err, foundArticle){
    if(foundArticle){
      res.send(foundArticle);
    }else{
      res.send("No Items found!!!");
    }
  });
})

.put(function(req, res){
  Article.update({title: req.params.articleTitle},
    {title: req.body.title, content: req.body.content},
    {overwrite: true},
    function(err){
      if(!err){
        res.send("Successfully updated the article");
      }else{
        res.send(err);
      }
    });
});

app.listen(3000, function() {
  console.log("server is running on port 3000");
});
