#!/bin/env python
# -*-coding:utf-8-*-

from coin.views.btc_view import BtcView

from coin.controllers import btc_obj


urls = [
    ("btc", BtcView, btc_obj),
]

restful_urls = [
    ("/v1/api/coin/btc/broadcast", BtcView, btc_obj, "post_action_broadcast", ["POST"]),
    ("/v1/api/coin/btc/fee", BtcView, btc_obj, "get_action_fee", ["GET"]),
    ("/v1/api/coin/btc/balance", BtcView, btc_obj, "get_action_balance", ["GET"]),
    ("/v1/api/coin/btc/transaction", BtcView, btc_obj, "get_action_transaction", ["GET"]),
    ("/v1/api/coin/btc/transaction_detail", BtcView, btc_obj, "get_action_transaction_detail", ["GET"]),
]
