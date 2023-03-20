const express = require('express') 

const app = express() 
const port = 5000;

app.get('/', function(req,res){
    res.render("index.ejs")
})
app.listen(port, function(){
    console.log(`listening on port ${port}`);
})