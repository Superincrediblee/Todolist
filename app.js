const express = require("express")
const bodyParser = require("body-parser")
const mongoose = require("mongoose")
const _ = require("lodash")
// &w=majority 
const app = express()
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended:true}))
app.use(express.static("public"))
mongoose.connect("mongodb+srv://Superincrediblee:england123@cluster0.tkyd8kf.mongodb.net/todolistDB", {useNewUrlParser: true})
const itemsSchema ={
  name: String
}
const Item =mongoose.model("item", itemsSchema)
const item1 = new  Item({
   name: "welcome to your Todolist"
})
const item2 = new  Item({
   name: "Hit the + Button to add a new item"
})
const item3 = new  Item({
   name: "<-- Hit this to delete an item"
})
const defaultItems = [item1,item2,item3]
const listSchema ={
  name:String,
  items:[itemsSchema]
}
const List= mongoose.model("List", listSchema)


/* let items=["Food", "Cloths", "Sleep"]
let workItems=[]; */

app.get("/",function(req,res){

  Item.find({},function(err,foundItems){
   if (foundItems.length === 0){
      Item.insertMany(defaultItems, function(err){
       if (err){
          console.log(err)
        }
        else {
          console.log("Succesfully Saved default items to DB")
        }
      })
      res.redirect("/")
    }
    else{
  console.log(foundItems)
    res.render("list", {listTitle:"Today", newtime:foundItems})
  }
  })
  })
 
 
/* app.post("/", function(req,res){
   item = req.body.newItem 
   items.push(item)
   res.redirect("/")
})
 */
/* app.post("/", function(req,res){
  let item=req.body.newItem;
  if(req.body.list === "work"){
  workItems.push(items)
  res.redirect("/work")
}else{
  items.push(item)
  res.redirect("/")
}
}) */
app.post("/", function(req,res){
  const newName =req.body.newItem
  const listName =req.body.list
  const item = new Item ({
    name:newName
  })
  if (listName === "Today"){
    item.save()
    res.redirect("/")
  }else{
    List.findOne({name:listName}, function(err,foundList){
      foundList.items.push(item);
      foundList.save();
      res.redirect("/" + listName)
    })
  }
  

})
app.get("/:customlist",function(req,res){
  const customlist= _.capitalize(req.params.customlist)
  List.findOne({name:customlist},function(err,foundList){
    if (!err){
      if (!foundList){
        // create a new list
        const list = new List({
          name: customlist,
          items:defaultItems
        }) 
         list.save()
         res.redirect("/" + customlist)     
      }
      else{
        //show an existing list
        res.render("list", {listTitle:foundList.name, newtime:foundList.items})
      }
    }
  })
  })

 
app.post("/delete", function(req,res){
  const checkeditem =req.body.checkbox;
  const listName =req.body.listName;
  if (listName === "Today"){
  Item.findByIdAndRemove(checkeditem, function(err){
    if (err){
      console.log(err)
    }else{
      console.log("deleted")
    }
  }) 
  res.redirect("/")}
  else{
    List.findOneAndUpdate({name:listName},{$pull:{items:{_id:checkeditem}}}, function(err,foundList){
      if (!err){
         res.redirect("/" + listName)
      }
    })
  }
})
app.get("/work",function(req,res){
  res.render("list",{listTitle:"Work List", newtime:workItems})
})
app.get("/about",function(req,res){
   res.render("about")
})

/* let port = process.env.PORT;
if ( port == null || port =="" ){
  port ==3000;
} */
const port = process.env.PORT || 8080;
  app.listen(port, function(){
  console.log("Server has started on Port " + port)
})
