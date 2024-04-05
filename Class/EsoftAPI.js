import axios from 'axios';
import dotenv from 'dotenv'; dotenv.config();

export default class GetDataApi {
  #token = process.env.TOKEN;
  #dataObject = (argObj, start, rows) => {
    return {
      token: this.#token,
      report_id: argObj.report,
      fields: argObj.displayedFieldsArr,
      filter_query: argObj.filterQuery,
      rows: rows,
      start: start
    };
  };
  #valueCountFunc = (address, argObj) => {
    return axios.post(`${address}/requestReportRowsCount`, this.#dataObject(argObj))
      .then((response) => { return response.data; })
      .catch((error) => { console.error('Ошибка:', error); });
  };
  #valueFunc = (address, argObj, start, rows) => {
    return axios.post(`${address}/requestRawReportData`, this.#dataObject(argObj, start, rows))
      .then((response) => { return response.data; })
      .catch((error) => { console.error('Ошибка:', error); });
  };
  valueCount;
  value;
  result = [];
  constructor(argObj, start, rows) {
    console.log(process.env.TOKEN);
    let address;
    if (argObj.actual == "old") { address = process.env.OLD_BI; } else { address = process.env.NEW_BI; }
    this.valueCount = () => {
      return this.#valueCountFunc(address, argObj);
    };
    this.value = (start, rows) => {
      return this.#valueFunc(address, argObj, start, rows);
    };
  }
}