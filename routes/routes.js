/**
 * Created by Brendan Betts on 11/17/13.
 */

app = module.parent.exports.app;


app.get('/', function(req, res){
    res.render('../views/index');
});
