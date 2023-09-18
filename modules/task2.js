const fs = require('fs');
const csv = require('csvtojson');
const { pipeline } = require('stream');

const csvFilePath = './Data/nodejs-hw1-ex1.csv';
const resultPath = './Data/csvJson.txt';

const readStream = fs.createReadStream(csvFilePath);
const writeStream = fs.createWriteStream(resultPath);
  
pipeline(
  readStream,
  csv(),
  writeStream,
  (error) => {
    if(error) {
      console.log('faild');
    }
  }

)
