#!/bin/env python
# -*-coding:utf-8-*-

from coin.views.qtum_view import QtumView


restful_urls = [
    ("/api/qtum/broadcast", QtumView, None, "post_action_broadcast", ["POST"]),
    ("/api/qtum/fee", QtumView, None, "get_action_fee", ["GET"]),
    ("/api/qtum/balance", QtumView, None, "get_action_balance", ["GET"]),
    ("/api/qtum/utxo", QtumView, None, "get_action_utxo", ["GET"]),
    ("/api/qtum/transaction", QtumView, None, "get_action_transaction", ["GET"]),
    ("/api/qtum/transaction_detail", QtumView, None, "get_action_transaction_detail", ["GET"]),
    ("/api/qtum/block", QtumView, None, "get_action_block", ["GET"]),
    ("/api/qtum/decode_tx", QtumView, None, "post_action_decode_tx", ["POST"]),
]
