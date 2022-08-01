const express = require('express');
const exphbs  = require('express-handlebars');
const bodyParser =require('body-parser');
const SettingsBill = require('./settings-bill');
const moment = require('moment');
moment().format();
const app = express();
const settingsBill = SettingsBill();
 app.engine('handlebars', exphbs.engine({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

app.use(express.static('public'))

 app.use(bodyParser.urlencoded({ extended: false }))
 app.use(bodyParser.json())

app.get('/', function(req,res){
    res.render('index',
    {setting: settingsBill.getSettings(),
    totals: settingsBill.totals(),
    color : settingsBill.colours()
    });
});

app.post('/settings', function(req,res){
    
    settingsBill.setSettings({

        callCost: req.body.callCost,
        smsCost: req.body.smsCost,
        warningLevel: req.body.warningLevel,
        criticalLevel: req.body.criticalLevel
    });

    res.redirect('/');
});

app.post('/action', function(req,res){
    
    settingsBill.recordAction(req.body.actionType)
    res.redirect('/');
});

app.get('/actions', function(req,res){
    let bills = settingsBill.actions()

    for(let key of bills){
        key.timestring = moment(key.timestamp,'dddd, MMMM Do YYYY, h:mm:ss a' ).fromNow()
    }
    res.render("actions",{
        actions: bills
    });
    
});

app.get('/actions/:actionType', function(req,res){

    const actionType = req.params.actionType;

    res.render("actions",{actions: settingsBill.actionsFor(actionType)});
});
const PORT = process.env.PORT || 3007
app.listen(PORT, function(){
    console.log('App starting on port', PORT)
});