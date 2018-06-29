#!/bin/env python
# -*- coding:utf8 -*-

import json
import requests

from common.base_view import BaseView
from common import error_msg
from common.mylog import logger

from bit.network import NetworkAPI
from bit.network import get_fee
from bit.network import satoshi_to_currency_cached
from bit.network import currency_to_satoshi_cached


class BchView(BaseView):
    URL = "https://bch-chain.api.btc.com/"
    def post_action_broadcast(self):
        if not self.check_input_arguments(["tx_hex"]):
            return self._response(error_msg.PARAMS_ERROR)
        #url = "{0}/v3/tools/tx-publish".format(self.URL)
        url = "https://bch-insight.bitpay.com/api/tx/send"
        try:
            r = requests.post(url, data={
                "rawtx": self._input["tx_hex"],
                }).json()
            if r.get("txid", "") != "":
                return self._response()
            else:
                logger.error("broadcast tx_hex error {0}".format(r))
                return self._response(error_msg.SERVER_ERROR)
        except Exception as e:
            logger.error("broadcast tx_hex http error {0}".format(e))
            return self._response(error_msg.SERVER_ERROR)

    def get_action_fee(self):
        #data = get_fee() 
        data = 1
        return self._response(data=data)

    def get_action_balance(self):
        if not self.check_input_arguments(["address"]):
            return self._response(error_msg.PARAMS_ERROR)
        #url = "{0}/v3/address/{1}".format(self.URL, self._input["address"])
        #r = requests.get(url).json()
        url = "https://blockdozer.com/insight-api/addr/{}/utxo".format(self._input["address"])
        data = requests.get(url).json()
        satoshi = 0
        for i in data:
            if i["confirmations"] >= 6:
                satoshi += i["satoshis"]
        if satoshi != 0:
            url = "https://www.okcoin.com/api/v1/ticker.do?symbol=bch_usd"
            r = requests.get(url).json().get("ticker", {}).get("last", 0)
            cny = float(r) * 6.5 * satoshi / 100000000
        else:
            cny = 0
        data = dict(balance=str(satoshi), cny=float(cny))
        return self._response(data=data)

    def get_action_utxo(self):
        if not self.check_input_arguments(["address"]):
            return self._response(error_msg.PARAMS_ERROR)
        url = "{0}/v3/address/{1}/unspent".format(self.URL, self._input["address"])
        url = "https://blockdozer.com/api/addr/{}/utxo"
        url = "https://blockdozer.com/insight-api/addr/{}/utxo".format(self._input["address"])
        data = requests.get(url).json()
        self._data = [i for i in data if i["confirmations"] >= 6]
        return self._response()

    def get_action_transaction(self):
        if not self.check_input_arguments(["address", "page"]):
            return self._response(error_msg.PARAMS_ERROR)
        url = "{}/v3/address/{}/tx?page={}&pagesize=10".format(
                self.URL, self._input["address"], int(self._input["page"]) + 1)
        r = requests.get(url).json()
        self._data = r.get("data", {})
        if "total_count" in self._data:
            self._data["total_page"] = self._data.get("total_count", 0)
            del self._data["total_count"]
        return self._response()

    def get_action_block(self):
        url = "{0}/v3/block/latest".format(self.URL)
        r = requests.get(url).json()
        self._data = r.get("data", {}).get("height", 0)
        return self._response()

    def post_action_decode_tx(self):
        if not self.check_input_arguments(["tx_hex"]):
            return self._response(error_msg.PARAMS_ERROR)
        url = "{0}/v3/tools/tx-decode".format(self.URL)
        try:
            r = requests.post(url, data={
                "rawhex": self._input["tx_hex"],
                }).json()
            if r.get("err_no", -1) == 0:
                self._data = r.get("data", {})
                return self._response()
            else:
                logger.error("decode tx_hex error {0}".format(r))
                return self._response(error_msg.SERVER_ERROR)
        except Exception as e:
            logger.error("decode tx_hex http error {0}".format(e))
            return self._response(error_msg.SERVER_ERROR)
