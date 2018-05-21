#!/bin/env python
# -*-coding:utf-8-*-

from coin.views.bch_view import BchView


restful_urls = [
    ("/v1/api/bch/broadcast", BchView, None, "post_action_broadcast", ["POST"]),
    ("/v1/api/bch/fee", BchView, None, "get_action_fee", ["GET"]),
    ("/v1/api/bch/balance", BchView, None, "get_action_balance", ["GET"]),
    ("/v1/api/bch/utxo", BchView, None, "get_action_utxo", ["GET"]),
    ("/v1/api/bch/transaction", BchView, None, "get_action_transaction", ["GET"]),
    ("/v1/api/bch/transaction_detail", BchView, None, "get_action_transaction_detail", ["GET"]),
    ("/v1/api/bch/block", BchView, None, "get_action_block", ["GET"]),
    ("/v1/api/bch/decode_tx", BchView, None, "post_action_decode_tx", ["POST"]),
]
