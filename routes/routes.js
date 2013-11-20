/**
 * Created by Brendan Betts on 11/17/13.
 */

app = module.parent.exports.app;


app.get('/', function(req, res){
    res.render('../views/index');
});

app.get('/search', function(req, res){
    res.render('../views/search');
});

app.get('/connect', function(req, res){
    res.render('../views/connect');
});

app.get('/screen', function(req, res){
    res.render('../views/screen');
});