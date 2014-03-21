/**
 Created by Brendan Betts on 3/1/14.
 Email: brendan.betts@live.com
 */

app = module.parent.exports.app;
util = module.parent.exports.util;
var basePath = "../public/views/";

app.get("/", function(req,res){
    res.render(basePath + "splash");
    util.log("Rendering splash");
});

app.get("/index",function(req,res){
    res.render(basePath  + "index");
    util.log("Rendering index");
});

app.get("/search", function(req,res){
    res.render(basePath+"search");
    util.log("Rendering search");
});