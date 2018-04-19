#!/bin/env python
# -*- coding:utf8 -*-

import datetime
import hashlib
import random

import requests

from common.base_view import BaseView
from common.redis_ctl import redis_obj
from common.mylog import logger
from common import error_msg
from conf import settings


class UserView(BaseView):
    def get_action_code(self):
        if not self.check_input_arguments(["phone"]):
            return self._response(error_msg.PARAMS_ERROR)
        code = "".join([str(random.randint(0, 9)) for i in range(4)])
        url = "https://api.miaodiyun.com/20150822/industrySMS/sendSMS" 
        try:
            m = hashlib.md5()
            sid = "4bb28e9c0f194975bfe28214941690bd"
            token = "be9da0e2c8d04b5c86c9a105ac6e4a5d"
            ts = datetime.datetime.now().strftime("%Y%m%d%H%m%s")
            m.update("{0}{1}{2}".format(sid, token, ts).encode('utf-8'))
            sig = m.hexdigest()
            payload = {
                    "accountSid": sid,
                    "sig": sig,
                    "timestamp": ts,
                    "templateid": settings.TEMPLATEID,
                    "param": code,
                    "to": self._input["phone"]
                    }
            r = requests.post(url, data=payload)
            if r.json().get("respCode", "1") == "00000":
                return self._response(data=int(code))
            return self._response(error_msg.PHONE_NUMBER_ERROR)
        except Exception as e:
            logger.error("requets miaodiyun error {0}".format(e))
            return self._response(error_msg.SERVER_ERROR)
