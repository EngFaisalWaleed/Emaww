const { createClient } = require("redis");
const Redis = createClient({ url: process.env.REDIS_URL });

exports.configureaRedis = function (){
    Redis.on("error", (err) => console.log("Redis Error: ", err));
    (async () => await Redis.connect())();
    if (process.argv.length < 3) {
        console.log("Path to XML file not found");
        process.exit();
    }
}

exports.setRedisKey = async (key, value) =>{
  await Redis.set(key, JSON.stringify(value));
}

exports.quitRedis = async () => {
  await Redis.quit();
}

