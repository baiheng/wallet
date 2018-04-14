#!/bin/env python
# -*-coding:utf-8-*-

from common.base_controller import BaseController

from coin.models import Btc


class BtcController(BaseController):
    pass


btc_obj = BtcController(Btc)
