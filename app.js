const converter = require("xml-js");
const fileClient = require("fs");
const { configureaRedis, setRedisKey, quitRedis } = require('./config/redis')
configureaRedis();

const arguments = process.argv.slice(2);
const isPrint = arguments[0] === "-v";
const filePath = arguments[1].endsWith("xml") ? arguments[1] : undefined

if(!filePath) {
  console.log("Enter valid path to config.xml file");
  process.exit();
}

// read data from xml file
const data = fileClient.readFileSync(filePath);

//convert xml to json data
const result = converter.xml2js(data, { compact: true });
const resultant = result?.config;

const subdomains = resultant?.subdomains.subdomain.map(
  (subdomain) => subdomain._text
);

const cookies = resultant?.cookies.cookie.map((cookie) => ({
  key: `cookie:${cookie._attributes.name}:${cookie._attributes.host}`,
  value: cookie._text,
}));

setRedisKey("Subdomains List", subdomains);
isPrint && console.log(`Subdomains List: ${JSON.stringify(subdomains)}`);

cookies.map((cookie) => {
  setRedisKey(cookie.key, cookie.value);
  isPrint && console.log(`${cookie.key}: ${cookie.value}`);
});
quitRedis();
