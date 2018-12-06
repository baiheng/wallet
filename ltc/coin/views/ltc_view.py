#!/bin/env python
# -*- coding:utf8 -*-

import json
import requests
import time

from common.base_view import BaseView
from common import error_msg
from common.mylog import logger
from conf import settings

from bit.network import NetworkAPI
from bit.network import get_fee
from bit.network import satoshi_to_currency_cached
from bit.network import currency_to_satoshi_cached


cache = {
    "last_time": 0,
    "result": 0,
    "timeout": 30 * 60,
}
class LtcView(BaseView):
    URL = "http://127.0.0.1:3001/insight-lite-api"
    def post_action_broadcast(self):
        if not self.check_input_arguments(["tx_hex"]):
            return self._response(error_msg.PARAMS_ERROR)
        url = "{0}/tx/send".format(self.URL)
        try:
            r = requests.post(url, data={
                "rawtx": self._input["tx_hex"],
                })
            if r.status_code == requests.codes.ok:
                return self._response()
            else:
                logger.error("broadcast tx_hex error {0}".format(r.text))
                self._ret, self._msg = 50001, r.text
                return self._response()
        except Exception as e:
            logger.error("broadcast tx_hex http error {0}".format(e))
            return self._response(error_msg.SERVER_ERROR)

    def get_action_fee(self):
        data = 13
        return self._response(data=data)

    def get_action_balance(self):
        if not self.check_input_arguments(["address"]):
            return self._response(error_msg.PARAMS_ERROR)
        url = "{0}/addr/{1}/utxo".format(
                self.URL, self._input["address"])
        r = requests.get(url)
        if r.status_code != requests.codes.ok:
            return self._response(error_msg.SERVER_ERROR)
        data = r.json()
        satoshi = 0
        for i in data:
            if i["confirmations"] >= 6:
                satoshi += i["satoshis"]
        if satoshi != 0:
            if cache["last_time"] > int(time.time()) - cache["timeout"]:
                r = cache["result"]
            else:
                # url = "https://www.okcoin.com/api/v1/ticker.do?symbol=ltc_usd"
                # r = requests.get(url).json().get("ticker", {}).get("last", 0)
                url = "https://api.coinmarketcap.com/v1/ticker/litecoin/?convert=cny"
                r = requests.get(url).json()[0].get("price_cny", 0)
                cache["last_time"] = int(time.time())
                cache["result"] = float(r)
            cny = r * 6.5 * satoshi / 100000000
        else:
            cny = 0
        data = dict(balance=str(satoshi), cny=float(cny))
        return self._response(data=data)

    def get_action_utxo(self):
        if not self.check_input_arguments(["address"]):
            return self._response(error_msg.PARAMS_ERROR)
        url = "{0}/addr/{1}/utxo".format(
                self.URL, self._input["address"])
        r = requests.get(url)
        if r.status_code != requests.codes.ok:
            return self._response(error_msg.SERVER_ERROR)
        data = r.json()
        self._data = [i for i in data if i["confirmations"] >= 6]
        return self._response()

    def get_action_transaction(self):
        if not self.check_input_arguments(["address", "page"]):
            return self._response(error_msg.PARAMS_ERROR)
        start = int(self._input["page"]) * settings.PAGE_SIZE
        end = (int(self._input["page"]) + 1) * settings.PAGE_SIZE 
        url = "{0}/addr/{1}?from={2}&to={3}".format(
                self.URL,
                self._input["address"],
                start,
                end)
        r = requests.get(url)
        if r.status_code != requests.codes.ok:
            return self._response(error_msg.SERVER_ERROR)
        data = r.json()
        transactions = data.get("transactions", [])
        total_page = int(data.get("txApperances", 0) / settings.PAGE_SIZE) + 1
        rd = list()
        for i in transactions:
            url = "{0}/tx/{1}".format(self.URL, i)
            d = requests.get(url).json()
            rd.append(d)
        return self._response(data={"list": rd, "total_page": total_page})

    def get_action_block(self):
        url = "{0}/blocks?limit=1".format(self.URL)
        r = requests.get(url)
        if r.status_code != requests.codes.ok:
            return self._response(error_msg.SERVER_ERROR)
        data = r.json().get("blocks", [])[0].get("height", 0)
        return self._response(data=data)

    def post_action_decode_tx(self):
        if not self.check_input_arguments(["tx_hex"]):
            return self._response(error_msg.PARAMS_ERROR)
        url = "https://live.blockcypher.com/ltc/decodetx/"
        try:
            r = requests.post(url, data={
                "tx_hex": self._input["tx_hex"],
                "coin_symbol": "ltc",
                "csrfmiddlewaretoken": "0x7JG1aNt03Ovn4vPL7wz05s8F8DtUDq"
                }, cookies={"csrftoken": "0x7JG1aNt03Ovn4vPL7wz05s8F8DtUDq"})
            find_key = "<pre><small>"
            s = r.text.find(find_key)
            if s == -1:
                return self._response(error_msg.PARAMS_ERROR)
            else:
                e = r.text.find("</small>", s)
                result = r.text[s+len(find_key):e].replace("\n", "")
                self._data = json.loads(result)
                return self._response()
        except Exception as e:
            logger.error("decode tx_hex http error {0}".format(e))
            return self._response(error_msg.SERVER_ERROR)
