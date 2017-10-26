const colors = require('colors');
const moment = require('moment');

class MyLog{

  info(string){
    let blabla = '['+ moment().format("MMMM Do YYYY, h:mm a")+']';
     let info = `INFO :: ${string}`;
     console.log(`${blabla} ${info}`.blue);
  }
   error(string){
     let blabla = '['+ moment().format("MMMM Do YYYY, h:mm a")+']';
     let error = `ERROR :: ${string}`;
    console.log(`${blabla} ${error}`.red);
  }
}

module.exports = new MyLog();
