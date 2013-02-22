

var app = {
    balls : 3,
    plungerY : 930,
    hScore : Ti.App.Properties.getInt('high_score') || 0,
    
    MAX_IMPULSE : 1500,
    
    isIn : function(obj, a) {
      var i = a.length;
      while (i--) {
        if (a[i] === obj) {
          return true;
        }
      }
      return false;
    }
};

var alloy = require("co.lanica.platino");
var box2d = require('co.lanica.box2d');

Ti.include('world.js', 'ui.js');

app.ui.startGame();
app.ui.createStartWindow().open();
