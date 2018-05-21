#!/bin/env python
# -*-coding:utf-8-*-

from coin.views.bch_view import BchView


restful_urls = [
    ("/api/bch/broadcast", BchView, None, "post_action_broadcast", ["POST"]),
    ("/api/bch/fee", BchView, None, "get_action_fee", ["GET"]),
    ("/api/bch/balance", BchView, None, "get_action_balance", ["GET"]),
    ("/api/bch/utxo", BchView, None, "get_action_utxo", ["GET"]),
    ("/api/bch/transaction", BchView, None, "get_action_transaction", ["GET"]),
    ("/api/bch/transaction_detail", BchView, None, "get_action_transaction_detail", ["GET"]),
    ("/api/bch/block", BchView, None, "get_action_block", ["GET"]),
    ("/api/bch/decode_tx", BchView, None, "post_action_decode_tx", ["POST"]),
]
