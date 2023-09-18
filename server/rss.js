const https = require('https');

const getToken = (requestOptions, postData) => {
  const rss = https.request(requestOptions, (res) => {
    console.log('statusCode:', res.statusCode);
    console.log('headers:', res.headers);
  
    res.on('data', (d) => {
      console.log(d)
      const response = d.toString('utf-8')
      console.log(response)
      // const { key } = response.data.attributes
      // process.env.TOKEN = key;
      // console.log(process.env.TOKEN)
    });
  })
  rss.on('error', (err) => {
    console.log(err)
  })
  rss.write(postData)
  rss.end()
}

export default getToken;

