const fs = require('fs');
const _ = require('lodash');
const {
  spawn
} = require('child_process');
const moment = require('moment');
const axios = require('axios');

const marketsAndPair = [
  // {
  // 	exchange: "binance",
  // 	currency: "USDT",
  // 	asset: "BTC"
  // },
  {
    exchange: "binance",
    currency: "USDT",
    asset: "ETH"
  }
]

// const candleSizes = [15, 30, 60, 90] // Đơn vị phút
// const candleSizes = [15, 30, 60, 90, 120, 240, 480, 1440] // Đơn vị phút
const candleSizes = [60]
const dateRanges = [{
    trainDaterange: {
      from: "2018-01-01 00:00:00",
      to: "2018-07-31 00:00:00"
    },
    backtestDaterange: {
      from: "2018-08-01 00:00:00",
      to: "2018-09-30 00:00:00"
    }
  },
  // {
  // 	trainDaterange: {
  // 		from: "2019-01-02 01:00:00",
  // 		to: "2019-01-31 23:00:00"
  // 	},
  // 	backtestDaterange: {
  // 		from: "2019-02-01 01:00:00",
  // 		to: "2019-02-12 23:00:00"
  // 	}
  // }
]

const strategyForBacktest = [{
  name: "OMLBCT",
  settings: {
    startBalance: 2500,
    startAsset: 0,
    stopLoss: -10,
    takeProfit: 2,
    amountForOneTrade: 100,
    stopTrade: 24,
    backtest: true,
    dataFile: "data-for-backtest/backtest-data.json"
  }
}];

const modelName = "random_forest";
const strategyGetData = {
  name: "writeCandle2Json",
  settings: {
    fileName: "",
    stopTrade: 24,
    stopLoss: -10,
    takeProfit: 2
  }
};
const nameConfig = "backtest-config.js";
const nameSampleConfig = "sample-config-for-backtest.js";

const api = "http://localhost:5000/backtest";

const main = async () => {
  let sampleConfig = require('./' + nameSampleConfig);
  // Duyệt qua hết các candle size
  for (let i = 0; i < candleSizes.length; i++) {
    // Duyệt qua hết các date range
    for (let j = 0; j < dateRanges.length; j++) {
      // Duyệt qua các cặp tiền
      for (let k = 0; k < marketsAndPair.length; k++) {
        for (let l = 0; l < strategyForBacktest.length; l++) {
          // Chuẩn bị config để lấy data
          let config = _.cloneDeep(sampleConfig);

          console.log("Generate config...");
          generateConfig(config, marketsAndPair[k], candleSizes[i], strategyGetData);

          console.log("Generate config for prepare train data...");
          let trainDataName = generateConfigTrain(config, marketsAndPair[k], strategyForBacktest[l], candleSizes[i], dateRanges[j].trainDaterange);
          // Ghi file config train
          console.log("Write config for prepare train data...");
          fs.writeFileSync(nameConfig, await generateConfigString(config));

          // Chạy backtest để chuẩn bị train data
          console.log("Run gekko for prepare train data...");
          await runGekkoProcess(nameConfig);

          console.log("Generate config for prepare test data...");
          let testDataName = generateConfigTest(config, marketsAndPair[k], strategyForBacktest[l], candleSizes[i], dateRanges[j].backtestDaterange);
          // Ghi file config backtest
          console.log("Write config for prepare test data...");
          fs.writeFileSync(nameConfig, await generateConfigString(config));

          // Chạy backtest để chuẩn bị backtest data
          console.log("Run gekko for prepare test data...");
          await runGekkoProcess(nameConfig);

          // Gửi train data và test data cho python
          let trainData = require('./' + trainDataName);
          let testData = require('./' + testDataName);
          console.log("Connect python ...");
          let result = await sendTrainAndTestDataToPythonServer(trainData, testData, dateRanges[j].trainDaterange, dateRanges[j].backtestDaterange, candleSizes[i], modelName);
          console.log('Connect python done ...')
          if (result) {
            let backtestData = result;
            // Write backtest data
            console.log("Write backtest data for backtest ...");
            fs.writeFileSync(strategyForBacktest[l].settings.dataFile, JSON.stringify(backtestData));
            console.log("Generate config for backtest ...");
            generateConfigBacktest(config, dateRanges[j].backtestDaterange, strategyForBacktest[l]);
            // Ghi file config để backtest
            console.log("Write config for backtest ...");
            fs.writeFileSync(nameConfig, await generateConfigString(config));
            console.log("Run gekko for backtest test data...");
            await runGekkoProcess(nameConfig)
          }
        }
        //
      }
    }
    // clearDataAfterDone()
  }
}

const sendTrainAndTestDataToPythonServer = (trainData, testData, trainDaterange, backtestDaterange, candleSize, modelName) => {
  return new Promise((resolve, reject) => {
    // remove vwp from train data
    trainData = _.map(trainData, temp => {
      return _.omit(temp, ['vwp']);
    })
    // remove action & vwp from test data
    testData = _.map(testData, temp => {
      return _.omit(temp, ['action', 'vwp'])
    })

    let data = {
      metadata: {
        train_daterange: {
          from: new Date(trainDaterange.from).getTime(),
          to: new Date(trainDaterange.to).getTime()
        },
        backtest_daterange: {
          from: new Date(backtestDaterange.from).getTime(),
          to: new Date(backtestDaterange.to).getTime()
        },
        candle_size: candleSize,
        model_name: modelName
      },
      train_data: trainData,
      backtest_data: testData
    }
    axios.post(api, data)
      .then(function (response) {
        //handle
        resolve(response.data);
      })
      .catch(function (error) {
        console.log(error + "");
        resolve(false);
      });
  })
}

const generateNameFile = (train = true, marketsAndPair, strategyForBacktest, candleSize, daterange) => {
  //-${daterange.from}-${daterange.to}
  let fileName = [
    marketsAndPair.exchange,
    marketsAndPair.asset,
    marketsAndPair.currency,
    strategyForBacktest.name,
    candleSize,
    moment.utc(daterange.from).format("DD-MM-YY"),
    moment.utc(daterange.to).format("DD-MM-YY")
  ].join('_');

  return `data-for-backtest/${train ? "train" : "test"}_${fileName}.json`
}

const generateConfig = (config, marketsAndPair, candleSizes, strategyGetData) => {
  // Chuẩn bị data train để gửi cho model
  // Tắt hết pluggin
  for (let m in config) {
    if (_.isObject(config[m]))
      config[m].enable = false;
  }
  // Bật lại những pluggin cần thiết
  let plugginEnable = ["tradingAdvisor", "paperTrader", "performanceAnalyzer"];
  for (let m = 0; m < plugginEnable.length; m++) {
    if (_.isObject(config[plugginEnable[m]]))
      config[plugginEnable[m]].enable = true;
  }
  // Chỉnh sàn + cặp tiền
  config["watch"] = marketsAndPair;
  // Chỉnh candle size
  config["tradingAdvisor"].candleSize = candleSizes;
  // Chỉnh lại thuật toán để ghi candle ra file
  config["tradingAdvisor"].method = strategyGetData.name;
  config[strategyGetData.name] = strategyGetData.settings;
}

const generateConfigTrain = (config, marketsAndPair, strategyForBacktest, candleSizes, trainDaterange) => {
  let filename = generateNameFile(true, marketsAndPair, strategyForBacktest, candleSizes, trainDaterange);
  config[strategyGetData.name].fileName = filename;
  //Chỉnh daterange
  config["backtest"].daterange = trainDaterange;

  return filename;
}

const generateConfigTest = (config, marketsAndPair, strategyForBacktest, candleSizes, backtestDaterange) => {
  let filename = generateNameFile(false, marketsAndPair, strategyForBacktest, candleSizes, backtestDaterange);
  // Chuẩn bị tập test
  //Chỉnh daterange
  config["backtest"].daterange = backtestDaterange;
  // name file out
  config[strategyGetData.name].fileName = filename;
  return filename;
}

const generateConfigBacktest = (config, backtestDaterange, strategy) => {
  config["backtest"].daterange = backtestDaterange;
  config["tradingAdvisor"].method = strategy.name;
  config[strategy.name] = strategy.settings;
  config["myBacktestResultExporter"].enabled = true;
  config[""]
}

const generateConfigString = (config) => {
  return new Promise((resolve, reject) => {
    let dataOut = '';
    dataOut += `var config = {}; \n`;
    for (let attr in config) {
      dataOut += `config['${attr}'] = ${JSON.stringify(config[attr])};\n`
    }
    dataOut += "module.exports = config;";
    resolve(dataOut);
  })
}

const runGekkoProcess = (nameConfig) => {
  return new Promise((resolve, reject) => {
    const process = spawn('node', ['gekko', '-c', nameConfig, '-b']);
    process.stdout.on('data', (data) => {
      console.log(`${data}`);
    });

    process.stderr.on('data', (data) => {
      console.log(`stderr: ${data}`);
    });

    process.on('close', (code) => {
      console.log(`child process exited with code ${code}`);
      resolve();
    });
  })
}

const clearDataAfterDone = () => {
  spawn('rm', [nameConfig]);
}

main()