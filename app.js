var express = require('express'),
    app = express(),
    bodyParser = require('body-parser'),
    mongoose = require('mongoose');

mongoose.connect("mongodb://localhost/yelp_camp", {useMongoClient: true}); 
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));//shows us the public folder files
app.set("view engine", "ejs");

//SCHEMA SETUP
var campgroundSchema = new mongoose.Schema ({
    name: String,
    image: String,
    description: String
});

var Campground = mongoose.model("Campground", campgroundSchema);

// Campground.create(//adding campgrounds to the database
//     {
//       name: "Howick Falls", 
//       image: 'https://farm4.staticflickr.com/3765/9166952406_c057b6395d.jpg',
//       description: "No bathrooms or wifi but the Falls are beautiful. Supermarket is within walking distance."

//     }, function (err, newcamp){
//       if(err){
//         console.log("computer says no");
//         console.log(err)
//       } else {
//         console.log("You have added a new campground");
//         console.log(newcamp);
//       }
//  });


app.get("/", function (req, res){
  res.render("landing");//the name of the ejs file in views folder
});

//INDEX route - show all campgrounds
app.get("/campgrounds", function (req, res){
  Campground.find({}, function(err, allCampgrounds){//getting the campgrounds from the database
    if(err){
      console.log(err);
    } else {
     
    res.render ("index", {campground: allCampgrounds});
     }
    });

});

//CREATE route - add new campgrounds to database
app.post("/campgrounds", function (req, res){
  var name = req.body.name;
  var image = req.body.image;
  var desc = req.body.description;
  var newCampGround = {name:name, image:image, description: desc}
  //create new campground and save to the db
  Campground.create(newCampGround, function(err, newlycreatedcamp){
    if(err){
      console.log(err);
     } else {
        res.redirect("/campgrounds");
     }
  });
 
});

//NEW show form to create new campground
app.get("/campgrounds/new", function (req, res){
  res.render("new.ejs");
});

//SHOW - find chosen campground by id and show more info
app.get("/campgrounds/:id", function (req, res){
  Campground.findById(req.params.id, function(err, foundCampground){
    if(err){
      console.log(err);
    } else {
      res.render("show", {campground: foundCampground});
    }
  });

 });

app.listen(9901, function(){
  console.log("server listening on 9901");
});