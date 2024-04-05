import { google } from "googleapis";
/* поместите ключ сервисного аккаунта в корень проекта */
import keys from "../keys.json" assert { type: 'json' };

export default class googleSh {

  #client = new google.auth.JWT(keys.client_email, null, keys.private_key, [
    "https://www.googleapis.com/auth/spreadsheets",
  ]);

  #gsapi = google.sheets({
    version: "v4",
    auth: this.#client
  });

  async getData(idSheet, range) {
    let answer = await this.#gsapi.spreadsheets.values.get({
      spreadsheetId: [idSheet], range: [range],
      valueRenderOption: "UNFORMATTED_VALUE",
      dateTimeRenderOption: "FORMATTED_STRING"
    });
    let rawData = answer.data.values;
    console.log(`${idSheet} • ${range} • get - ✓`);
    return rawData;
  }

  async setData(idSheet, range, value) {
    let answer = await this.#gsapi.spreadsheets.values.update({
      spreadsheetId: [idSheet],
      range: `${range}`,
      valueInputOption: 'USER_ENTERED',
      resource: {
        values: value
      }
    });
    console.log(`${idSheet} • ${range} • set - ✓`);
  }

  async clearRange(idSheet, range) {
    await this.#gsapi.spreadsheets.values.clear({
      spreadsheetId: idSheet,
      range: `${range}`
    });
    console.log(`${idSheet} • ${range} • clear - ✓`);
  }

  async getListName(idSheet) {
    let answer = await this.#gsapi.spreadsheets.get({
      spreadsheetId: idSheet,
    });
    return answer.data.sheets.map(item => {
      return item.properties.title;
    });
  }

  async scanSheet(idSheet, range, prefix) {
    let sheets = await this.getListName(idSheet);
    let arr = await Promise.all(sheets.map(sh => this.getData(idSheet, `${sh}!${range}`)
      .then(res => res.map(item => prefix ? [prefix, sh, ...item] : [sh, ...item]))))
      .then(res => res.flat());
    return arr;
  }

  rowToObject(headArr, rowsArr) {
    return rowsArr.map((rows, i) => {
      let resObj = {};
      headArr.forEach((headItem, i) => resObj[headItem] = rows[i]);
      return resObj;
    });
  }

  objToSQLRow(headArr, objArr) {
    let toSQL = (obj) => {
      return `('${headArr.map(headItem => `${obj[headItem]}`).join('\',\'')}')`;
    };
    return objArr.map(obj => toSQL(obj)).join(',');
  }

  constructor() {
    this.#client.authorize();
  }
}