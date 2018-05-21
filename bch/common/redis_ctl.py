#!/bin/env python
# -*- coding: UTF-8 -*-
import redis

from .mylog import logger
from conf import settings


class Redis():

    def __init__(self, host='localhost', port=6379, db=0, pwd=None, socket_timeout=10):
        '''
        http://redis-py.readthedocs.org/en/latest/
        '''
        self._host = host
        self._port = port
        self._which_db = db
        self._pwd = pwd
        self._socket_timeout = socket_timeout
        self._db = None
        self._connect_db()

    def __getattr__(self, attr):
        if self._check_connect():
            return getattr(self._db, attr)
        else:
            def f(*args, **kwargs):
                return None
            return f

    def _connect_db(self):
        self._db = None
        try:
            self._db = redis.StrictRedis(
                host=self._host,
                port=int(self._port),
                db=self._which_db,
                password=self._pwd,
                socket_timeout=self._socket_timeout,
                charset='utf-8'
            )

            return self._is_db_connected()
        except Exception as err:
            logger.error("connect redis error: %s" % err)
            return False

    def _is_db_connected(self):
        try:
            if self._db.ping() == True:
                return True
            else:
                return False
        except Exception as err:
            logger.error("redis is disconnect, err info: %s" % err)
        return False

    def _check_connect(self):
        if not self._is_db_connected():
            if not self._connect_db():
                logger.error("redis is disconnect !!")
                return False
        return True


redis_obj = Redis(
        host=settings.REDIS_HOST,
        port=settings.REDIS_PORT,
        db=settings.REDIS_DB,
        pwd=settings.REDIS_PWD)
