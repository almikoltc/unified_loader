import googleSh from "./Class/googleSh.js";

let session = new googleSh();
let sheets;
let arr;

/* Обновление источников для свода */
console.log('обновление свода по численности из node расчетника');
sheets = await session.getListName('1E9qq8uZM8t-2LYJ6y2xdETVUaPwNqm4-ZlDb9ZkWA6k');
arr = await Promise
  .all(sheets.map(sh => session.getData('1E9qq8uZM8t-2LYJ6y2xdETVUaPwNqm4-ZlDb9ZkWA6k', sh)
    .then(res => res.map(item => [sh, ...item]))))
  .then(res => res.flat());
arr = arr.filter(item => (item[4] === 'Численность, всего без гр.0' && item[3] !== 'АУП') || (item[4] === 'Численность, всего без доп.персонала и без гр.0' && item[3] === 'АУП'));
await session.clearRange("1e9tOssU2GsRnzftOCFctZxfw3N_PSnE_6vg0I28MKsU", "Данные");
await session.setData("1e9tOssU2GsRnzftOCFctZxfw3N_PSnE_6vg0I28MKsU", "Данные", arr);

/* Обновление свода ауп без гр.0 и аутсорса */
console.log('обновление свода ауп без гр.0 и аутсорса');
sheets = await session.getListName('1E9qq8uZM8t-2LYJ6y2xdETVUaPwNqm4-ZlDb9ZkWA6k');
arr = await Promise
  .all(sheets.map(sh => session.getData('1E9qq8uZM8t-2LYJ6y2xdETVUaPwNqm4-ZlDb9ZkWA6k', sh)
    .then(res => res.map(item => [sh, ...item]))))
  .then(res => res.flat());
arr = arr.filter(item => item[4] === 'Численность, всего без доп.персонала и без гр.0');
await session.clearRange("1zy4bN2vDxzjwkpXTFC3A7FP3c0bIIES-m09HCRzJB0Y", "Данные", arr);
await session.setData("1zy4bN2vDxzjwkpXTFC3A7FP3c0bIIES-m09HCRzJB0Y", "Данные", arr);

/* обновление Серые МОП */

// sheets = await session.getData('1d_HrwtmQR9uPzMCs7RTlMv4GGN5GMqGf4ofrEoa5h9A', "Свод (переход+увол)!A:AM");
// await session.clearRange("1-qHByP-w0DwUn78yjTnrNJHny3ZFliepSLbzVz2A8pc", "Свод (переход+увол)~");
// await session.setData("1-qHByP-w0DwUn78yjTnrNJHny3ZFliepSLbzVz2A8pc", "Свод (переход+увол)~!A1", sheets);

// sheets = await session.getData('1wAyXeeciD7LL9tF8z5MjNxbloaFsWcvpQrr3clrL8ZY', "Приоритеты таблица!A:AM");
// await session.clearRange("1-qHByP-w0DwUn78yjTnrNJHny3ZFliepSLbzVz2A8pc", "Приоритеты таблица~");
// await session.setData("1-qHByP-w0DwUn78yjTnrNJHny3ZFliepSLbzVz2A8pc", "Приоритеты таблица~!A1", sheets);

sheets = await session.getData('1-qHByP-w0DwUn78yjTnrNJHny3ZFliepSLbzVz2A8pc', "Результирующий (восстановление)!A:AM");
await session.clearRange("1lmyxik-WU4B2TZeEJ6QjXF-5oMVHY5CjyW291yZIpFE", "СкрМОП");
await session.setData("1lmyxik-WU4B2TZeEJ6QjXF-5oMVHY5CjyW291yZIpFE", "СкрМОП!A1", sheets);

/* обновление Выполнение планов 2024 */
sheets = await session.getData('1e9tOssU2GsRnzftOCFctZxfw3N_PSnE_6vg0I28MKsU', "Свод!A:Z");
await session.clearRange("1lmyxik-WU4B2TZeEJ6QjXF-5oMVHY5CjyW291yZIpFE", "Свод фактических показателей ОП+ОА");
await session.setData("1lmyxik-WU4B2TZeEJ6QjXF-5oMVHY5CjyW291yZIpFE", "Свод фактических показателей ОП+ОА!A1", sheets);

/* Обновление HR статистики */
sheets = await session.getData('1lmyxik-WU4B2TZeEJ6QjXF-5oMVHY5CjyW291yZIpFE', "В.п. найм СПН!A:Z");
await session.clearRange("1x2JhlC7FBnQECXAnVmqlUG8oCNhbhi3Iq7eg7viQVlA", "В.п. найм СПН");
await session.setData("1x2JhlC7FBnQECXAnVmqlUG8oCNhbhi3Iq7eg7viQVlA", "В.п. найм СПН!A1", sheets);

sheets = await session.getData('1lmyxik-WU4B2TZeEJ6QjXF-5oMVHY5CjyW291yZIpFE', "В.п. укомплектованность СПН!A:Z");
await session.clearRange("1x2JhlC7FBnQECXAnVmqlUG8oCNhbhi3Iq7eg7viQVlA", "В.п. укомплектованность СПН");
await session.setData("1x2JhlC7FBnQECXAnVmqlUG8oCNhbhi3Iq7eg7viQVlA", "В.п. укомплектованность СПН!A1", sheets);

sheets = await session.getData('1lmyxik-WU4B2TZeEJ6QjXF-5oMVHY5CjyW291yZIpFE', "В.п. найм МОП!A:Z");
await session.clearRange("1x2JhlC7FBnQECXAnVmqlUG8oCNhbhi3Iq7eg7viQVlA", "В.п. найм МОП");
await session.setData("1x2JhlC7FBnQECXAnVmqlUG8oCNhbhi3Iq7eg7viQVlA", "В.п. найм МОП!A1", sheets);

sheets = await session.getData('1lmyxik-WU4B2TZeEJ6QjXF-5oMVHY5CjyW291yZIpFE', "В.п. укомплектованность МОП!A:Z");
await session.clearRange("1x2JhlC7FBnQECXAnVmqlUG8oCNhbhi3Iq7eg7viQVlA", "В.п. укомплектованность МОП");
await session.setData("1x2JhlC7FBnQECXAnVmqlUG8oCNhbhi3Iq7eg7viQVlA", "В.п. укомплектованность МОП!A1", sheets);

