var config = {}; 
config['debug'] = true;
config['watch'] = {"exchange":"binance","currency":"USDT","asset":"ETH"};
config['tradingAdvisor'] = {"enabled":true,"method":"OMLBCT","candleSize":60,"historySize":0,"enable":true};
config['OMLBCT'] = {"stopLoss":-10,"takeProfit":2,"amountForOneTrade":100,"stopTrade":24,"backtest":true,"dataFile":"data-for-backtest/backtest-data.json"};
config['writeCandle2Csv'] = {"short":10,"long":21,"signal":9,"thresholds":{"down":-0.025,"up":0.025,"persistence":1,"low":30,"high":70},"interval":14,"fileName":"BTC_USDT_RSI_MACD.csv","enable":false};
config['LSTM'] = {"short":10,"long":21,"signal":9,"thresholds":{"down":-0.025,"up":0.025,"persistence":1,"low":30,"high":70},"interval":14,"api":"http://127.0.0.1:5000/advice","enable":false};
config['MACD'] = {"short":12,"long":26,"signal":9,"thresholds":{"down":-0.025,"up":0.025,"persistence":1},"enable":false};
config['RSI-MACD'] = {"short":10,"long":21,"signal":9,"thresholds":{"down":-0.025,"up":0.025,"persistence":1,"low":30,"high":70},"interval":14,"enable":false};
config['paperTrader'] = {"enabled":true,"reportInCurrency":true,"simulationBalance":{"asset":0,"currency":5000},"feeMaker":0,"feeTaker":0,"feeUsing":"maker","slippage":0,"enable":true};
config['multiPaperTrader'] = {"enabled":false,"reportInCurrency":true,"simulationBalance":{"asset":1,"currency":100},"feeMaker":0.15,"feeTaker":0.25,"feeUsing":"maker","slippage":0.05,"enable":false};
config['performanceAnalyzer'] = {"enabled":true,"riskFreeReturn":5,"enable":true};
config['multiPerformanceAnalyzer'] = {"enabled":false,"riskFreeReturn":5,"enable":false};
config['trader'] = {"enabled":false,"key":"","secret":"","username":"","passphrase":"","enable":false};
config['eventLogger'] = {"enabled":false,"enable":false};
config['pushover'] = {"enabled":false,"sendPushoverOnStart":false,"muteSoft":true,"tag":"[GEKKO]","key":"","user":"","enable":false};
config['mailer'] = {"enabled":false,"sendMailOnStart":true,"email":"","muteSoft":true,"password":"","tag":"[GEKKO] ","server":"smtp.gmail.com","smtpauth":true,"user":"","from":"","to":"","ssl":true,"port":"","enable":false};
config['pushbullet'] = {"enabled":false,"sendMessageOnStart":true,"sendOnAdvice":true,"sendOnTrade":true,"muteSoft":true,"key":"","email":"jon_snow@westeros.com","tag":"[GEKKO]","enable":false};
config['kodi'] = {"host":"http://ip-or-hostname:8080/jsonrpc","enabled":false,"sendMessageOnStart":true,"enable":false};
config['ircbot'] = {"enabled":false,"emitUpdates":false,"muteSoft":true,"channel":"#your-channel","server":"irc.freenode.net","botName":"gekkobot","enable":false};
config['telegrambot'] = {"enabled":false,"emitTrades":false,"token":"YOUR_TELEGRAM_BOT_TOKEN","enable":false};
config['twitter'] = {"enabled":false,"sendMessageOnStart":false,"muteSoft":false,"tag":"[GEKKO]","consumer_key":"","consumer_secret":"","access_token_key":"","access_token_secret":"","enable":false};
config['xmppbot'] = {"enabled":false,"emitUpdates":false,"client_id":"jabber_id","client_pwd":"jabber_pw","client_host":"jabber_server","client_port":5222,"status_msg":"I'm online","receiver":"jabber_id_for_updates","enable":false};
config['campfire'] = {"enabled":false,"emitUpdates":false,"nickname":"Gordon","roomId":null,"apiKey":"","account":"","enable":false};
config['redisBeacon'] = {"enabled":false,"port":6379,"host":"127.0.0.1","channelPrefix":"","broadcast":["candle"],"enable":false};
config['slack'] = {"enabled":false,"token":"","sendMessageOnStart":true,"muteSoft":true,"channel":"","enable":false};
config['ifttt'] = {"enabled":false,"eventName":"gekko","makerKey":"","muteSoft":true,"sendMessageOnStart":true,"enable":false};
config['candleWriter'] = {"enabled":true,"enable":false};
config['adviceWriter'] = {"enabled":false,"muteSoft":true,"enable":false};
config['backtestResultExporter'] = {"enabled":false,"writeToDisk":false,"data":{"stratUpdates":false,"portfolioValues":true,"stratCandles":true,"roundtrips":true,"trades":true},"enable":false};
config['myBacktestResultExporter'] = {"enabled":true,"writeToDisk":true,"data":{"stratUpdates":true,"portfolioValues":true,"stratCandles":true,"roundtrips":true,"trades":true},"fileNamePrefix":"Export-","dataOut":{"info":{"backtest.market.exchange":"Exchange","backtest.market.currency":"Currency","backtest.market.asset":"Asset","candleSize":"Candle Size"},"table":{"rawData":{"backtest.tradingAdvisor.method":"Name","performanceReport.startPrice":"Begin Price","endPrice":"End Price","performanceReport.startBalance":"Begin Balance","performanceReport.balance":"End Balance"},"recipe":{"Start Time":"moment(get(this, \"dates.start\",\"\")).format('YYYY-MM-DD HH:mm:ss')","End time":"moment(get(this, \"dates.end\",\"\")).format('YYYY-MM-DD HH:mm:ss')","Buy":"_.filter(this.trades, trade => trade.action == \"buy\").length","Sell":"_.filter(this.trades, trade => trade.action == \"sell\").length","Market":"`${((this.endPrice - this.performanceReport.startPrice)/this.performanceReport.startPrice)*100}%`","Profit":"`${((this.performanceReport.balance - this.performanceReport.startBalance)/this.performanceReport.startBalance)*100}%`"}}},"enable":false};
config['adapter'] = "sqlite";
config['sqlite'] = {"path":"plugins/sqlite","dataDirectory":"history","version":0.1,"journalMode":"DELETE","dependencies":[],"enable":false};
config['postgresql'] = {"path":"plugins/postgresql","version":0.1,"connectionString":"postgres://user:pass@localhost:5432","database":null,"schema":"public","dependencies":[{"module":"pg","version":"7.4.3"}],"enable":false};
config['mongodb'] = {"path":"plugins/mongodb","version":0.1,"connectionString":"mongodb://localhost/gekko","dependencies":[{"module":"mongojs","version":"2.4.0"}],"enable":false};
config['backtest'] = {"daterange":{"from":"2018-04-15 09:00:00","to":"2018-05-01 01:00:00"},"batchSize":50,"enable":false};
config['importer'] = {"daterange":{"from":"2019-02-20 00:00:00","to":"2019-03-13 00:00:00"},"enable":false};
config['DEMA'] = {"weight":21,"thresholds":{"down":-0.025,"up":0.025},"enable":false};
config['PPO'] = {"short":12,"long":26,"signal":9,"thresholds":{"down":-0.025,"up":0.025,"persistence":2},"enable":false};
config['varPPO'] = {"momentum":"TSI","thresholds":{"weightLow":120,"weightHigh":-120,"persistence":0},"enable":false};
config['RSI'] = {"interval":14,"thresholds":{"low":30,"high":70,"persistence":1},"enable":false};
config['TSI'] = {"short":13,"long":25,"thresholds":{"low":-25,"high":25,"persistence":1},"enable":false};
config['UO'] = {"first":{"weight":4,"period":7},"second":{"weight":2,"period":14},"third":{"weight":1,"period":28},"thresholds":{"low":30,"high":70,"persistence":1},"enable":false};
config['CCI'] = {"constant":0.015,"history":90,"thresholds":{"up":100,"down":-100,"persistence":0},"enable":false};
config['StochRSI'] = {"interval":3,"thresholds":{"low":20,"high":80,"persistence":3},"enable":false};
config['custom'] = {"my_custom_setting":10,"enable":false};
config['talib-macd'] = {"parameters":{"optInFastPeriod":10,"optInSlowPeriod":21,"optInSignalPeriod":9},"thresholds":{"down":-0.025,"up":0.025},"enable":false};
config['tulip-adx'] = {"optInTimePeriod":10,"thresholds":{"down":-0.025,"up":0.025},"enable":false};
config['I understand that Gekko only automates MY OWN trading strategies'] = false;
config['writeCandle2Json'] = {"fileName":"data-for-backtest/test_binance_ETH_USDT_OMLBCT_60_15-04-18_01-05-18.json","stopTrade":24,"stopLoss":-10,"takeProfit":2};
module.exports = config;