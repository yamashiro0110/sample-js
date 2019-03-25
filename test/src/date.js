var now = new Date();
console.log("now", now);

var nowPlus10 = new Date();
nowPlus10.setHours(now.getHours() + 10);
console.log("nowPlus10", nowPlus10);

var nowOfGMT = now.toGMTString();
console.log('nowOfGMT', nowOfGMT);
