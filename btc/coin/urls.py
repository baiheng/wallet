#!/bin/env python
# -*-coding:utf-8-*-

from coin.views.btc_view import BtcView

from coin.controllers import btc_obj


urls = [
    ("btc", BtcView, btc_obj),
]

restful_urls = [
    ("/api/btc/broadcast", BtcView, btc_obj, "post_action_broadcast", ["POST"]),
    ("/api/btc/fee", BtcView, btc_obj, "get_action_fee", ["GET"]),
    ("/api/btc/balance", BtcView, btc_obj, "get_action_balance", ["GET"]),
    ("/api/btc/utxo", BtcView, btc_obj, "get_action_utxo", ["GET"]),
    ("/api/btc/transaction", BtcView, btc_obj, "get_action_transaction", ["GET"]),
    ("/api/btc/transaction_detail", BtcView, btc_obj, "get_action_transaction_detail", ["GET"]),
    ("/api/btc/block", BtcView, btc_obj, "get_action_block", ["GET"]),
    ("/api/btc/decode_tx", BtcView, btc_obj, "post_action_decode_tx", ["POST"]),
]
