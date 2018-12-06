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
```shell
    yum install golang
    yum install gmp-devel
    git clone https://github.com/ethereum/go-ethereum
    cd go-ethereum
    make geth
```

2. 启动geth， 
```shell
    sudo mkdir -p /data/logs/geth/
    #  测试环境: info_rinkeby.log  现网环境： info.log
    nohup geth --rpc --rpccorsdomain "*" --rpcapi "db,eth,net,web3" --rpcport "12080" > /data/logs/geth/info.log 2>&1 
    nohup geth --rpc --rpccorsdomain "*" --rpcapi "db,eth,net,web3" --rpcport "17080" --rinkeby  > /data/logs/geth/info_rinkeby.log 2>&1 #测试环境
```

3. 使用web3js模块连接本地EVM服务，进行以太坊相关操作

