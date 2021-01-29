"use strict";

const main = require("./app/main");
const config = fetch("/configuration/config.json");
const versions = fetch("/configuration/version.json");
const about = fetch("/configuration/about.html");
const getJson = (r) => r.json();
const getText = (r) => r.text();
Promise
  .all([config.then(getJson), versions.then(getJson), about.then(getText)])
  .then(([config, versions, about]) => {
    const combinedConfig = { ...config, ...versions, aboutHtml: about };
    main(combinedConfig);
  });
