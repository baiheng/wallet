#!/bin/env python
# -*-coding:utf-8-*-

import os
import importlib

# 先加载这里的logger
from common.mylog import logger
from conf import settings

from sanic import Sanic


app = Sanic(__name__)


modules = [
    'account',
    'coin'
]

def dispatch(item):
    async def _dispatch(*args, **kwargs):
        obj = item[1]
        kwargs["controller_obj"] = item[2]
        return obj(*args, **kwargs).dispatch()
    return _dispatch

methods = ["GET", "POST", "PUT", "DELETE", "HEAD", "OPTIONS"]

for i in modules:
    for j in getattr(importlib.import_module('{0}.urls'.format(i)), 'urls'):
        url_prefix = "/v1/{0}/{1}".format(i, j[0])
        app.add_route(dispatch(j), url_prefix, methods=methods)


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=settings.SERVER_PORT, debug=True)
