import googleSh from "./Class/googleSh.js";

let session = new googleSh();

console.log('Обновление СВОДа Текучести & Закрепляемости');

let data_2 = await session.getData(
  '1FXYnWrb-PwJK2KxbU3GkGZLy8WX6QdFlZFfs3F95CHQ', "Текучесть_СПН!A:CX"
);
await session.setData("1bVxbn0M2POfHp7pMAj8KcgLsFGH7t6dgo7dZvgBsp4U", "Текучесть R ОП без гр.0", data_2.filter(item => {
  return item[1] != 'Алексеевка (Валуйки, Вейделевка, Алексеевка, Бирюч, Новый Оскол, Короча, Волоконовка)';
}));

let data_3 = await session.getData('1FXYnWrb-PwJK2KxbU3GkGZLy8WX6QdFlZFfs3F95CHQ', "Текучесть_МОП!A:CX");
await session.setData("1bVxbn0M2POfHp7pMAj8KcgLsFGH7t6dgo7dZvgBsp4U", "Текучесть МОП без гр.0",
  data_3.filter(item => item[1] != 'Алексеевка (Валуйки, Вейделевка, Алексеевка, Бирюч, Новый Оскол, Короча, Волоконовка)'));

let data_4 = await session.getData('17dJ0zbpCVf2VbwjSiuNecZWnJ7GDgdgi3ZmF9Gw-ae8', "Закрепляемость R ОП!A2:CV");
await session.setData("1bVxbn0M2POfHp7pMAj8KcgLsFGH7t6dgo7dZvgBsp4U", "Закрепляемость R ОП",
  data_4.filter(item => !(['Алексеевка (куст)', 'Тюмень (Ленина)', 'Тюмень (Артамонова)', 'Москва (Север)', 'Москва (Юг)', 'Москва (Сити)', 'Москва (Одинцово)'].includes(item[1]))));
let data_5 = await session.getData('17dJ0zbpCVf2VbwjSiuNecZWnJ7GDgdgi3ZmF9Gw-ae8', "Закрепляемость МОП!A2:CV");
await session.setData("1bVxbn0M2POfHp7pMAj8KcgLsFGH7t6dgo7dZvgBsp4U", "Закрепляемость МОП",
  data_5.filter(item => !(['Алексеевка (куст)', 'Тюмень (Ленина)', 'Тюмень (Артамонова)', 'Москва (Север)', 'Москва (Юг)', 'Москва (Сити)', 'Москва (Одинцово)'].includes(item[1]))));