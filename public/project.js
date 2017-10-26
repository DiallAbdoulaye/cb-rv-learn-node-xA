const http = require('http');
const _ = require('lodash');
const url = require('url');
const path = require('path');
const fs = require('fs');
const moment = require('moment');
const mLog = require('../modules/mLog.js');
const colors = require('colors');
const uuid = require('uuid');




let port = process.argv[2] || 8080;





const server = http.createServer((req,res)=>{
  let content = res.setHeader('content-type', 'text/html');
  if (req.url == '/') {
    req.url = 'index.html';
  }
  let pathName = path.join(__dirname, req.url);
  if (req.method == 'POST' && req.url == '/add-session') {
        let body = '';

        req.on('data', (data) =>{
            body += data;
        })
        req.on('end', () => {
          console.log(body);
          let sessionID = uuid.v4(body);
          let cookie = res.setHeader('set-cookie', 'sessionID=' + sessionID);
          fs.appendFile("../.sessions/"+ sessionID, body, function (err) {
          if (err) throw err;
          console.log('Saved !');
        });
          res.end();
        })
  }
  else if (req.method == 'GET') {
    if (req.headers.cookie) {
      function parseCookies(req) {
            let list = {},
            rc = req.headers.cookie;
            rc && rc.split(';').forEach(function(cookie) {
            var parts = cookie.split('=');
            list[parts.shift().trim()] = decodeURI(parts.join('='));
          });
          return list;
      }
      console.log(req.headers.cookie);
      let cookie = parseCookies(req).sessionID;
      console.log(cookie);
      let data = fs.readFileSync("../.sessions/" + cookie, 'utf8');
      res.setHeader('x-my-user-data', data);
    }

  fs.createReadStream(pathName)
  .on('open', () =>{
    mLog.info(`${req.method} ${req.url}`);

  })
  .on('error', (error)=>{
        let error404FileName = path.join(__dirname,'404.html');
        let content = fs.readFileSync(error404FileName);
        res.write(content);
        let err = `The URL ${req.url} does not exist`;
        mLog.error(err);
        // console.log(`Content-type : ${content}`);
        res.end();

  }).pipe(res);

  }
}).listen(port, mLog.info('Server is running on port : '+ port));
