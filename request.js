/**
 * 複数のURLへ並列でリクエストして、その結果を一度に受け取るSample
 */

var request = require('request');

Promise.resolve()
  .then(() => {
    console.log('step1: 複数URLを次のPromiseに渡す');

    return [
      'https://raw.githubusercontent.com/yamashiro0110/sample-node-js/master/README.md',
      'https://raw.githubusercontent.com/yamashiro0110/sample-node-js/master/LICENSE'
    ];
  })
  .then((urls) => {
    console.log('step2: 複数URLへのrequestをPromiseでwrapする', urls);
    
    var requests = urls.map((url, index) => {
      return new Promise((resolve, reject) => {
        request(url, (error, response, body) => {
          resolve({
            "url": url,
            "result": response.statusCode,
            "index": index,
            "body": body.substring(0, 100)
          })
        })
      })
    });

    return Promise.all(requests);
  })
  .then((value) => {
    console.log("step3: done", value);
  })
  .catch((resolve, reject) => {
    console.log("error", reject);
  });
