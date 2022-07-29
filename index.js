const express = require('express');
const exphbs  = require('express-handlebars');
const bodyParser =require('body-parser');
const SettingsBill = require('./settings-bill1');
 const moment = require('moment');
//const settingsBill1 = require('./settings-bill1');

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

   // console.log(settingsBill.getSettings());
    res.redirect('/');
});

app.post('/action', function(req,res){
    
    settingsBill.recordAction(req.body.actionType)
    res.redirect('/');
});

app.get('/actions', function(req,res){
    let bills = settingsBill.actions()

    for(let key of bills){
        key.timestring = moment(key.timestamp,'MMMM Do YYYY, h:mm:ss' ).fromNow()
    }
    res.render("actions",{
        actions: bills
    });
    
});

app.get('/actions/:actionType', function(req,res){

    const actionType = req.params.actionType;
   

    res.render("actions",{actions: settingsBill.actionsFor(actionType)});
});
const PORT = process.env.PORT || 3011
app.listen(PORT, function(){
    console.log('APP STARTED AT PORT', PORT)
});