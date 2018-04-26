#!/bin/bash

# author: kidd

## 初始化参数
debug=false;
targetProcess="";
logPath="/var/log/coin";

SCRIPTPATH="$(cd "$(dirname "$0")" && pwd)"

export PATH=$PATH:/usr/local/go-ethereum/build/bin/

## 获取命令行参数
while getopts ":d:f:" opts; do
	echo $opts $OPTARG
  case $opts in
      d) debug=$OPTARG ;;
      f) logPath=$OPTARG ;;
      ?) ;;
  esac
done

killProcess(){
	PID=`ps -ef | grep "$targetProcess" | grep -v "grep" | awk '{print   $2}'`;
	ps -ef | grep "$targetProcess" | grep -v "grep";
	if [[ $? -eq 0 ]]; then
		kill -9 $PID;
	fi
}

# 杀死正在运行的进程
killAllProcess(){
	targetProcess="geth";
	killProcess;
	targetProcess="coinAccess";
	killProcess;
	targetProcess="coinEth";
	killProcess;
}


createLogFile(){
	if [ ! -d "$logPath" ]; then
	  mkdir -p $logPath;
	fi
}

startGeth(){
	if [[ "$debug" = true ]]; then
		nohup geth --light --lightkdf --rpc --rpccorsdomain "localhost" --rpcapi "db,eth,net,web3" --rpcport "17080" --rinkeby  >> "$logPath/$targetProcess.log" 2>&1 &
		return;
	else
		nohup geth --light --lightkdf --lightpeers 15 --rpc --rpccorsdomain "localhost" --rpcapi "db,eth,net,web3" --rpcport "12080" >> "$logPath/$targetProcess.log" 2>&1 &
	fi
}

startAccess(){
	cd $SCRIPTPATH;
	cd access;
	npm install;
	if [[ "$debug" = true ]]; then
		DEBUG=true PORT=8080 nohup node ./bin/coinAccess >> "$logPath/$targetProcess.log" 2>&1 &
	else
		DEBUG=false PORT=8080 nohup node ./bin/coinAccess >> "$logPath/$targetProcess.log" 2>&1 &
	fi
}

startEth(){
	cd $SCRIPTPATH;
	cd eth;
	npm install;
	if [[ "$debug" = true ]]; then
		DEBUG=true nohup node ./bin/coinEth >> "$logPath/$targetProcess.log" 2>&1 &
	else
		DEBUG=false nohup node ./bin/coinEth >> "$logPath/$targetProcess.log" 2>&1 &
		echo $?
	fi
}


killAllProcess;
createLogFile;
targetProcess="geth";
startGeth;
targetProcess="coinAccess";
startAccess;
targetProcess="coinEth";
startEth;
echo $debug $logPath;
exit;
