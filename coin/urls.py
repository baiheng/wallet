#!/bin/env python
# -*-coding:utf-8-*-

from coin.views.btc_view import BtcView

from coin.controllers import btc_obj


urls = [
    ("btc", BtcView, btc_obj),
]
