const fs = require('fs');
const csv = require('csv');

//filepath
var gps_path = "./dat/93/gps.csv";
var work_path = "./dat/93/work.csv";
var out_path =  "./dat/93/result.csv";

//変換後の配列を格納
var newData = [];

var outData = [];

//処理（跡でpipeに食べさせる）
const parser = csv.parse({ from_line: 2 },(error, data) => {

    //内容出力
    // console.log('初期データ');
    // console.log(data);


    //ループしながら１行ずつ処理
    data.forEach((element, index, array) => {
        let row = [];
        //debug
        // row.push(element[8]);//date
        // row.push(element[9]);//time
        // let date = new Date(element[8] + ' ' + element[9] + ' GMT');
        let date = new Date(element[0] + ' ' + element[1] + ' GMT');
        // row.push(date);//time

        row.push(date.getTime());//time
        // row.push(element[12]);//lat
        // row.push(element[13]);//lon
        row.push(element[2]);//lat
        row.push(element[3]);//lon
        // row.push(date);//time
        row.push(element[0]);
        row.push(element[1]);

        //新たに1行分の配列(row)を作成し、新配列(newData)に追加。
        newData.push(row);
    })

    // console.log('処理データ');
    // console.log(newData);

    fs.createReadStream(work_path).pipe(parser2);

})

const parser2 = csv.parse({ from_line: 2 },(error, data) => {
  let count = 0;
  data.forEach((element2, index, array) => {
    count++;
    let s = element2[0].split('-');
    let now = s[0] + s[1] + ' GMT';
    let dnow = new Date(now);
    // console.log(now);
    // console.log(dnow);
    let t = dnow.getTime();

    // debug
    // let lat = element[9];//lat
    // let lon = element[10];//lon
    // console.log(t + ',' + lat + ',' + lon);

    let closest = [0,0,0]//,lat,lon];
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
    // let kenzan = Math.abs(lat - closest[1]) + Math.abs(lon - closest[2]);
    // console.log( count + ',' +kenzan);
    // if (kenzan > 0) {
    //   console.log("error");
    //   // process.exit(1);
    // }
    outData.push([element2[0], closest[3],closest[4],closest[1],closest[2]]);

  })
  //write
  csv.stringify(newData,(error,output)=>{
      fs.writeFile('out.csv',output,(error)=>{
          console.log('処理データをCSV出力しました。');
      })
  })

  //write
  csv.stringify(outData,(error,output)=>{
      fs.writeFile(out_path,output,(error)=>{
          console.log('処理データをCSV出力しました。');
      })
  })

})

//読み込みと処理を実行
fs.createReadStream(gps_path).pipe(parser);
