#!/bin/env python
# -*- coding:utf8 -*-
import requests

from common.base_view import BaseView
from common import error_msg
from common.mylog import logger

from bit.network import NetworkAPI
from bit.network import get_fee
from bit.network import satoshi_to_currency_cached
from bit.network import currency_to_satoshi_cached


class BtcView(BaseView):
    def post_action_broadcast(self):
        if not self.check_input_arguments(["tx_hex"]):
            return self._response(error_msg.PARAMS_ERROR)
        try:
            NetworkAPI.broadcast_tx(self._input.get("tx_hex", None))
        except Exception as e:
            logger.error("broadcast_tx error tx:{0}. error:{1}".format(
                self._input.get("tx_hex"), e))
            return self._response(error_msg.SERVER_ERROR)
        return self._response()

    def get_action_fee(self):
        data = get_fee() 
        return self._response(data=data)

    def get_action_balance(self):
        if not self.check_input_arguments(["address"]):
            return self._response(error_msg.PARAMS_ERROR)
        satoshi = NetworkAPI.get_balance(self._input["address"]) 
        if satoshi != 0:
            cny = satoshi_to_currency_cached(satoshi, "cny")
        else:
            cny = 0
        data = dict(satoshi=satoshi, cny=cny)
        return self._response(data=data)

    def get_action_transactions(self):
        if not self.check_input_arguments(["address"]):
            return self._response(error_msg.PARAMS_ERROR)
        page_num = self._input.get("page_num", 0)
        url = "https://insight.bitpay.com/api/txs?address={0}&pageNum={1}".format(
                self._input["address"], page_num)
        data = requests.get(url).json()
        rdata = list()
        for i in data.get("txs", []):
            tmp = dict()
            tmp["receive"] = 0
            tmp["send"] = 0
            tmp["time"] = i.get("time", 0)
            tmp["txid"] = i.get('txid', "")
            for j in i.get("vin", []):
                if j.get("addr", "") == self._input["address"]:
                    tmp["send"] += j.get("valueSat", 0)
            for j in i.get("vout", []):
                if self._input["address"] in j.get("scriptPubKey", {}).get("addresses", []):
                    tmp["receive"] += currency_to_satoshi_cached(j.get("value", 0), "btc")
            rdata.append(tmp)
        return self._response(data=rdata)

    def get_action_transaction_detail(self):
        if not self.check_input_arguments(["tx_id"]):
            return self._response(error_msg.PARAMS_ERROR)
        url = "https://insight.bitpay.com/api/tx/{0}".format(self._input["tx_id"])
        r = requests.get(url)
        return self._response(data=r.json())
