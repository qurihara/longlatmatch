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
        // row.push(element[8]);//date
        // row.push(element[9]);//time
        let date = new Date(element[8] + ' ' + element[9] + ' GMT');
        // row.push(date);//time

        row.push(date.getTime());//time
        row.push(element[12]);//lat
        row.push(element[13]);//lon

        //新たに1行分の配列(row)を作成し、新配列(newData)に追加。
        newData.push(row);
    })

    // console.log('処理データ');
    // console.log(newData);

    fs.createReadStream('master.csv').pipe(parser2);

})

const parser2 = csv.parse({ from_line: 2 },(error, data) => {
  let count = 0;
  data.forEach((element, index, array) => {
    count++;
    let s = element[8].split('-');
    let now = s[0] + s[1] + ' GMT';
    let dnow = new Date(now);
    // console.log(now);
    // console.log(dnow);
    let t = dnow.getTime();

    //debug
    let lat = element[9];//lat
    let lon = element[10];//lon

    console.log(t + ',' + lat + ',' + lon);

    let closest = [t,lat,lon];
    newData.some((element, index, array) => {
        // console.log(t + ',' +element[0] + '\n' )
        if (element[0] >= t){
          // console.log("scanning end")
          let last = element;
          let a = element[0] - t;
          let b = t - closest[0];
          if (a > b) {
            // do nothing
          }else{
            closest = last;
          }

          return true;
        }
        closest = element;
    })
    // use closest
    // console.log(closest);
    let kenzan = Math.abs(lat - closest[1]) + Math.abs(lon - closest[2]);
    console.log( count + ',' +kenzan);
    if (kenzan > 0) {
      console.log("error");
      process.exit(1);
    }

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
