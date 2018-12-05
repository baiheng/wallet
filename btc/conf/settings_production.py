#!/bin/env python
# -*- coding:utf8 -*-


class BaseConfig(object):
    DEBUG = True
    CREATE_TABLE = True
    SERVER_PORT = 10009

    # 3小时后自动重连mysql
    MYSQL_CONNECT_TIMEOUT = 3 * 24 * 60 * 60

    # token
    # 7天有效期
    TOKEN_TIMEOUT = 7 * 24 * 60 * 60 
    PRIVATE_KEY = '8434567812345678'

    # 数据查询ip
    #MYSQL_HOST = '127.0.0.1'
    MYSQL_HOST = '111.230.12.37'
    MYSQL_PORT = 3306
    MYSQL_USER = "root"
    MYSQL_PWD = ""
    MYSQL_DB = "test_wallet"

    # redis
    REDIS_HOST = '127.0.0.1'
    REDIS_PORT = 6379
    REDIS_DB = '1'
    REDIS_PWD = ''

    # 验证码过期时间 5分钟
    CODE_EXPIRE_TIME = 5 * 60
    TEMPLATEID = 219065158

    # btc cache time 1天
    CACHE_TIME = 24 * 60 * 60
