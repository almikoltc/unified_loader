import googleSh from "./Class/googleSh.js";

let session = new googleSh();
let sheets;
let arr;


sheets = await session.getData('1mS5JoLMe-lgqSdl_jcTV8YfqWYOkJU5bWIAl2eSy0TM', "#Res!A:E");
await session.clearRange('1lmyxik-WU4B2TZeEJ6QjXF-5oMVHY5CjyW291yZIpFE', "_импорт планов!A:E");
await session.setData('1lmyxik-WU4B2TZeEJ6QjXF-5oMVHY5CjyW291yZIpFE', "_импорт планов!A3", sheets
  .filter(item => [
    'Плановая численность R ОП (без гр. 0)',
    'Плановая численность менеджеров ОП',
    'План по найму R ОП',
    'План по найму менеджеров ОП'
  ].includes(item[1]))
  .map(item => {
    if (item[0] == 'Алексеевка (Валуйки, Вейделевка, Алексеевка, Бирюч, Новый Оскол, Короча, Волоконовка)') {
      item[0] = 'Алексеевка';
    }
    return item;
  }));

sheets = await session.getData('1mS5JoLMe-lgqSdl_jcTV8YfqWYOkJU5bWIAl2eSy0TM', "#Res!A:E");
await session.clearRange('1TxnklLs60wjvNAIhdT2SSMBgLrWpdSy8-uXHgbpR4L0', "#Res!A:E");
await session.setData('1TxnklLs60wjvNAIhdT2SSMBgLrWpdSy8-uXHgbpR4L0', "#Res!A1", sheets);

sheets = await session.getData('1NVKJMmiVaM8wPD4blvqzanoU76kMqzAPZMTOHtvtxjY', "#Res!A:E");
await session.clearRange('1k-ncMlmBMFWYY0f0IsUZwlIN75YZ5uNlNC7uB92hroQ', "#Res!A:E");
await session.setData('1k-ncMlmBMFWYY0f0IsUZwlIN75YZ5uNlNC7uB92hroQ', "#Res!A1", sheets);

