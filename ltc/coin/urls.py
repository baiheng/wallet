#!/bin/env python
# -*-coding:utf-8-*-

from coin.views.ltc_view import LtcView


restful_urls = [
    ("/api/ltc/broadcast", LtcView, None, "post_action_broadcast", ["POST"]),
    ("/api/ltc/fee", LtcView, None, "get_action_fee", ["GET"]),
    ("/api/ltc/balance", LtcView, None, "get_action_balance", ["GET"]),
    ("/api/ltc/utxo", LtcView, None, "get_action_utxo", ["GET"]),
    ("/api/ltc/transaction", LtcView, None, "get_action_transaction", ["GET"]),
    ("/api/ltc/transaction_detail", LtcView, None, "get_action_transaction_detail", ["GET"]),
    ("/api/ltc/block", LtcView, None, "get_action_block", ["GET"]),
    ("/api/ltc/decode_tx", LtcView, None, "post_action_decode_tx", ["POST"]),
]
