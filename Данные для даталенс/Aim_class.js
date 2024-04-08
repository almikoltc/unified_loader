export default class Aim {
  #offset = new Date().getTimezoneOffset() / 60;
  constructor(obj) {
    this.inputDate = new Date(obj.year, obj.month - 1, 1, -/* this.#offset */ 0, 0, 0, 0);
    this.periodStart = new Date(obj.year, obj.month - 1, 1, -/* this.#offset */ 0, 0, 0, 0);
    this.periodEnd = new Date(obj.year, obj.month, 1, -/* this.#offset */ 0, 0, 0, 0);
    this.monthEnd = new Date(obj.year, obj.month, 0, -/* this.#offset */ 0, 0, 0, 0);
    this.sheetID = obj.id;
    this.sheetRange = obj.range;
  };
};