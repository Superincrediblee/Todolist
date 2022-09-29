const express = require("express")
const bodyParser = require("body-parser")
const date = require(__dirname + "/date.js")
const app = express()
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended:true}))
app.use(express.static("public"))
let items=["Food", "Cloths", "Sleep"]
let workItems=[];
app.get("/",function(req,res){
  let day = date.getDate()
 
   res.render("list", {listTitle:day, newtime:items})
})
/* app.post("/", function(req,res){
   item = req.body.newItem 
   items.push(item)
   res.redirect("/")
})
 */
app.post("/", function(req,res){
  let item=req.body.newItem;
  if(req.body.list === "work"){
  workItems.push(items)
  res.redirect("/work")
}else{
  items.push(item)
  res.redirect("/")
}
})
app.get("/work",function(req,res){
  res.render("list",{listTitle:"Work List", newtime:workItems})
})
app.get("/about",function(req,res){
   res.render("about")
})
app.listen(3000, function(){
  console.log("Server is running on Port 3000")
})