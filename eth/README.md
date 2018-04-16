# eth

## 概述
本项目作为以太坊相关接口服务。

### 接口说明

region w { broadcast
	method: POST
	params:
		text
} region broadcast

### 以太坊客户端EVM启动

1. 安装以太坊客户端 geth
2. 启动geth， `geth --rpc --rpccorsdomain "*" --rpcapi "db,eth,net,web3" --rpcport "8080"` 
    测试环境 `geth --rpc --rpccorsdomain "*" --rpcapi "db,eth,net,web3" --rpcport "8080" --rinkeby`
3. 使用web3js模块连接本地EVM服务，进行以太坊相关操作

