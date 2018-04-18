#!/bin/bash

# author: kidd

## 初始化参数
debug=false;
targetProcess="";
logPath="/var/log/coin";

SCRIPTPATH="$(cd "$(dirname "$0")" && pwd)"


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
	ps -fe|grep processString | grep -v grep
	if [[ $? -eq 0 ]]; then
		kill -9 `ps -ef | grep "$targetProcess" | grep -v "grep" | awk "{print   $2}"`;
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
		nohup geth --rpc --rpccorsdomain "*" --rpcapi "db,eth,net,web3" --rpcport "17080" --rinkeby  > "$logPath/$targetProcess.log" 2>&1 &
		return;
	else
		nohup geth --rpc --rpccorsdomain "*" --rpcapi "db,eth,net,web3" --rpcport "12080" > "$logPath/$targetProcess.log" 2>&1 &
	fi
}

startAccess(){
	echo $SCRIPTPATH
	cd $SCRIPTPATH;
	cd access;
	if [[ "$debug" = true ]]; then
		PORT=17080 nohup node ./bin/coinAccess > "$logPath/$targetProcess.log" 2>&1 &
	else
		PORT=12080 nohup node ./bin/coinAccess > "$logPath/$targetProcess.log" 2>&1 &
	fi
}

startEth(){
	cd $SCRIPTPATH;
	cd eth;
	pwd
	if [[ "$debug" = true ]]; then
		PORT=17080 nohup node ./bin/coinEth > "$logPath/$targetProcess.log" 2>&1 &
	else
		PORT=12080 nohup node ./bin/coinEth > "$logPath/$targetProcess.log" 2>&1 &
	fi
}


killAllProcess;
createLogFile;
# targetProcess="geth";
# startGeth;
targetProcess="coinAccess";
startAccess;
targetProcess="coinEth";
startEth;
echo $debug $logPath;
exit;

targetProcess="coinAccess";
killProcess;
killProcess;



## 删除所有进程
## 创建log文件夹








#nohup geth --rpc --rpccorsdomain "*" --rpcapi "db,eth,net,web3" --rpcport "17080" --rinkeby  > /data/logs/geth/info_rinkeby.log 2>&1


