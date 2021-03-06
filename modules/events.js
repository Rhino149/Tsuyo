const fs = require("fs");
const util = require("util");
const promisify = util.promisify;
const readdir = promisify(fs.readdir);
const colors = require("colors");

module.exports = (client) => {
  readdir(__dirname + "/../events/", (err, files) => {
    files.forEach((file) => {
      if (!file.endsWith(".js")) return;
      const event = require(`../events/${file}`);
      const eventName = file.split(".")[0];
      if (err) return client.logger.error(err);

      client.on(eventName, event.bind(null, client));

      delete require.cache[require.resolve(`../events/${file}`)];

      console.log(
        colors.magenta(`Loading event: `) + colors.white(`${eventName}`)
      );
    });
  });
};
