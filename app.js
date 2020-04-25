const express = require('express');
const app = express();
const port = 3000;
const date = require(__dirname + "/router/date.js");
var parser = require('body-parser');
const mongoose = require('mongoose');

//mongodb+srv://LewisKlein:<password>@mangusta-58qhz.gcp.mongodb.net/test?retryWrites=true&w=majority

const url = "mongodb+srv://LewisKlein:M@ngusta1qw2Megust@@mangusta-58qhz.gcp.mongodb.net/newdb";
mongoose.connect(url, {useUnifiedTopology: true, useNewUrlParser: true});

app.use(parser.urlencoded({extended: true}));
app.use(express.static("public"));
app.set('view engine', 'ejs');

const itemsSchema = new mongoose.Schema({
  name : String
});
const Item = mongoose.model('Item', itemsSchema);



const item1 = new Item({
  name : "Going market on Saturday"
})
const defaultItems = [item1];


app.get('/', function(req, res){
  Item.find({}, function(err, foundItems){

    if(foundItems.length === 0){
      Item.insertMany(defaultItems, function(err){
        if(err){
          console.log(err);
        }
        else {
          console.log("Successfully written default values");
        }
      });
      res.redirect('/');
    }
    else{
        res.render('index', {listTitle: date.getDate(), newListItems : foundItems});
    }

  });

});

app.post('/delete', function(req, res){
  var checkedItemId = req.body.checkbox;

  //Modal.findByIdAndRemove();

  Item.findByIdAndRemove(checkedItemId, function(err){
    if (!err) {
      console.log("Successfully delete the item");
      res.redirect('/');
    }
  });
})


// IDEA: this is the bit for the post route

app.post('/', function(req, res){
  const itemName = req.body.newItem;

  const item = new Item({
    name : itemName
  });
  item.save();
  res.redirect('/');
});



app.listen(port, function(req, res){
  console.log("Server is up and running on port no " + port);
})
