import googleSh from "./Class/googleSh.js";
let session = new googleSh();
console.log('обновление свода ауп без гр.0 и аутсорса');

sheets = await session.getListName('1E9qq8uZM8t-2LYJ6y2xdETVUaPwNqm4-ZlDb9ZkWA6k');
arr = await Promise
  .all(sheets.map(sh => session.getData('1E9qq8uZM8t-2LYJ6y2xdETVUaPwNqm4-ZlDb9ZkWA6k', sh)
    .then(res => res.map(item => [sh, ...item]))))
  .then(res => res.flat());