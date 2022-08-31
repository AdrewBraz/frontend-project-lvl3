const https = require('https');

var postData = JSON.stringify({});

var options = {
  hostname: 'datorss.com',
  port: 443,
  path: '/api/tokens',
  method: 'POST',
  headers: {
       'Content-Type': 'application/x-www-form-urlencoded',
       'Content-Length': postData.length
     }
};

const rss = https.request(options, (res) => {
  console.log('statusCode:', res.statusCode);
  console.log('headers:', res.headers);

  res.on('data', (d) => {
    console.log(d)
    process.stdout.write(d);
  });
});

export default rss;

