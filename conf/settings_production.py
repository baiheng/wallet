#!/bin/env python
# -*- coding:utf8 -*-


class BaseConfig(object):
    DEBUG = True
    CREATE_TABLE = True

    # 3小时后自动重连mysql
    MYSQL_CONNECT_TIMEOUT = 3 * 24 * 60 * 60

    # token
    # 7天有效期
    TOKEN_TIMEOUT = 7 * 24 * 60 * 60 
    PRIVATE_KEY = '8434567812345678'

    # 数据查询ip
    MYSQL_HOST = '127.0.0.1'
    MYSQL_PORT = 3306
    MYSQL_USER = "root"
    MYSQL_PWD = ""
    MYSQL_DB = "test_wallet"
