const XLSX = require('xlsx');

const workBook = XLSX.readFile('./TransactionHistory-20210525.xlsx');

const sheet = workBook.SheetNames;

const workSheet = workBook.Sheets[sheet[0]];

let list = XLSX.utils.sheet_to_json(workSheet);

let json = JSON.stringify(list);

const exChange = {
  '时间': 'time',
  '交易类型': 'tradeType',
  '交易对': 'tradePair',
  '方向': 'tradeDirection',
  '价格': 'price',
  '数量': 'num',
  '成交额': 'trandeCost',
  '手续费': 'poundage'
}

const keys = Object.keys(exChange);
keys.forEach(v => {
  let reg = new RegExp(v, 'g');
  json = json.replace(reg, exChange[v]);
});

list = JSON.parse(json);

list.sort((a, b) => {
  return a.time - b.time;
});


// console.log(list);

let singleTrande = list[0].trandeCost / (list[0].num * (1 - 0.002));

let totalCost = 0;
let totalCoin = 0;

list.forEach(v => {
  if (v.tradeDirection === '买入') {
    totalCost += v.trandeCost;
    totalCoin += (v.num * (1 - 0.002))
  }
  if (v.tradeDirection === '卖出') {
    totalCost -= v.trandeCost;
    totalCost += parseFloat(v.poundage);
    totalCoin -= v.num
  }
});

console.log(`总币数：${totalCoin}`);

console.log(`最新成本：${totalCost / totalCoin}`);
