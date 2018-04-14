#!/bin/env python
# -*- coding:utf8 -*-

from common.base_view import BaseView
from common import error_msg
from common.mylog import logger

from bit.network import NetworkAPI
from bit.network import get_fee


class BtcView(BaseView):
    def post_action_broadcast(self):
        if not self.check_input_arguments(["tx_hex"]):
            return self._response(error_msg.PARAMS_ERROR)
        try:
            NetworkAPI.broadcast_tx(self._input.get("tx_hex", None))
        except Exception as e:
            logger.error("broadcast_tx error tx:{0}. error:{1}".format(
                self._input.get("tx_hex"), e))
            return self._response(error_msg.SERVER_ERROR)
        return self._response()


    def get_action_fee(self):
        data = get_fee() 
        print(data)
        return self._response(data=data)
