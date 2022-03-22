const axios = require("axios");
const fs = require("fs");
const jsdom = require("jsdom");

const { JSDOM } = jsdom;

const URL =
  "https://www.freecodecamp.org/news/all-emojis-emoji-list-for-copy-and-paste/";

const getEmojis = async () => {
  const { data } = await axios.get(URL);
  const result = {};
  const dom = new JSDOM(data);
  let category = null;

  const tableRows = dom.window.document.querySelectorAll("table tr");
  tableRows.forEach((row) => {
    const [col_1, col_2, col_3] = row.querySelectorAll("td");
    const emoji = col_1 && col_1.textContent;
    const meaning = col_2 && col_2.textContent;
    const unicode = col_3 && col_3.textContent;

    const isCategoryRow = emoji && !meaning && !unicode;

    if (isCategoryRow && !result[emoji]) {
      category = emoji;
      result[category] = [];
    }
    if (emoji && meaning && unicode && result[category]) {
      result[category].push({ emoji, meaning, unicode });
    }
  });
  fs.writeFileSync("emojis.json", JSON.stringify(result, null, 2), "utf-8");
};

getEmojis();
