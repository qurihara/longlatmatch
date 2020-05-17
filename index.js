const fs = require('fs');
const csv = require('csv');

//変換後の配列を格納
var newData = [];

//処理（跡でpipeに食べさせる）
const parser = csv.parse((error, data) => {

    //内容出力
    // console.log('初期データ');
    // console.log(data);


    //ループしながら１行ずつ処理
    data.forEach((element, index, array) => {
        let row = [];
        //debug
        row.push(element[8]);//date
        row.push(element[9]);//time
        let date = new Date(element[8] + ' ' + element[9] + ' GMT');
        row.push(date);//time

        row.push(date.getTime());//time
        row.push(element[12]);//lat
        row.push(element[13]);//lon

        //新たに1行分の配列(row)を作成し、新配列(newData)に追加。
        newData.push(row);
    })

    console.log('処理データ');
    console.log(newData);

    fs.createReadStream('master.csv').pipe(parser2);

})

const parser2 = csv.parse((error, data) => {
  data.forEach((element, index, array) => {
    let now = new Date(element[7]);
    console.log(now);
    let lat = element[8];//lat
    let lon = element[8];//lon
  })
  //write
  csv.stringify(newData,(error,output)=>{
      fs.writeFile('out.csv',output,(error)=>{
          console.log('処理データをCSV出力しました。');
      })
  })
})

//読み込みと処理を実行
fs.createReadStream('data.csv').pipe(parser);
