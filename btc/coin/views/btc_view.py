#!/bin/env python
# -*- coding:utf8 -*-

import time
import json
import requests

from common.base_view import BaseView
from common import error_msg
from common.mylog import logger

from bit.network import NetworkAPI
from bit.network import get_fee_cached
from bit.network import satoshi_to_currency_cached
from bit.network import currency_to_satoshi_cached
from bit.network.rates import set_rate_cache_time
from bit.network.fees import set_fee_cache_time


CACHE_TIME = 12 * 60 * 60
set_rate_cache_time(CACHE_TIME)
set_fee_cache_time(CACHE_TIME)
class BtcView(BaseView):
    URL = "https://blockchain.info/zh-cn/"
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
        data = get_fee_cached() 
        return self._response(data=data)

    def get_action_balance(self):
        if not self.check_input_arguments(["address"]):
            return self._response(error_msg.PARAMS_ERROR)
        #url = ("{}/q/addressbalance/{}?confirmations=6".format(
        #    self.URL,
        #    self._input["address"]))
        url = ("{}/unspent?active={}&confirmations=6".format(
                self.URL,
                self._input["address"]
                ))
        try:
            r = requests.get(url).json().get("unspent_outputs", [])
            satoshi = 0
            for i in r:
                satoshi += i.get("value", 0)
        except Exception as e:
            logger.error("requests address error{}".format(e))
            return self._response(error_msg.SERVER_ERROR)
        if satoshi != 0:
            cny = satoshi_to_currency_cached(satoshi, "cny")
        else:
            cny = 0
        data = dict(satoshi=str(satoshi), cny=float(cny), balance=str(satoshi))
        return self._response(data=data)

    def get_action_utxo(self):
        if not self.check_input_arguments(["address"]):
            return self._response(error_msg.PARAMS_ERROR)
        url = ("{}/unspent?active={}&confirmations=6".format(
                self.URL,
                self._input["address"]
                ))
        try:
            r = requests.get(url).json().get("unspent_outputs", [])
        except Exception as e:
            logger.error("requests utxo error{}".format(e))
            return self._response(error_msg.SERVER_ERROR)
        data = []
        for i in r:
            data.append({
                "amount": i.get("value", 0),
                "confirmations": i.get("confirmations", 0),
                "script": i.get("script", ""),
                "txid": i.get("tx_hash_big_endian", ""),
                "txindex": i.get("tx_output_n", ""),
                })
        return self._response(data=data)

    def get_action_transaction(self):
        if not self.check_input_arguments(["address", "page"]):
            return self._response(error_msg.PARAMS_ERROR)
        url = "https://insight.bitpay.com/api/txs?address={0}&pageNum={1}".format(
                self._input["address"], self._input["page"])
        data = requests.get(url).json()
        total_page = data.get("pagesTotal", 1)
        rdata = list()
        for i in data.get("txs", []):
            tmp = dict()
            receive = 0
            send = 0
            tmp["time"] = i.get("time", 0)
            tmp["txid"] = i.get('txid', "")
            tmp["blockhash"] = i.get("blockhash", "")
            tmp["blockheight"] = i.get("blockheight", "")
            tmp["confirmations"] = i.get("confirmations", 0)
            tmp["size"] = i.get("size", 0)
            tmp["fees"] = currency_to_satoshi_cached(i.get("fees", 0), "btc")
            vin = []
            vout = []
            for j in i.get("vin", []):
                if j.get("addr", "") == self._input["address"]:
                    send += j.get("valueSat", 0)
                s = dict()
                s["address"] = j.get("addr", "")
                s["value"] = j.get("valueSat", 0)
                vin.append(s)

            for j in i.get("vout", []):
                if self._input["address"] in j.get("scriptPubKey", {}).get("addresses", []):
                    receive += currency_to_satoshi_cached(j.get("value", 0), "btc")
                s = dict()
                s["address"] = j.get("scriptPubKey", {}).get("addresses", [""])[0]
                s["value"] = currency_to_satoshi_cached(j.get("value", "0"), "btc")
                vout.append(s)

            tmp["amount"] = receive - send
            if int(i.get("confirmations", 0)) > 6:
                tmp["status"] = "confirmed"
            else:
                tmp["status"] = "unconfirmed"
            tmp["vin"] = vin
            tmp["vout"] = vout

            rdata.append(tmp)
        return self._response(data=dict(list=rdata, total_page=total_page))

    def get_action_transaction_detail(self):
        if not self.check_input_arguments(["tx_id"]):
            return self._response(error_msg.PARAMS_ERROR)
        url = "https://insight.bitpay.com/api/tx/{0}".format(self._input["tx_id"])
        r = requests.get(url).json()
        self._data["blockhash"] = r.get("blockhash", "")
        self._data["blockheight"] = r.get("blockheight", "")
        self._data["confirmations"] = r.get("confirmations", 0)
        self._data["time"] = r.get("time", 0)
        self._data["size"] = r.get("size", 0)
        self._data["fees"] = currency_to_satoshi_cached(r.get("fees", 0), "btc")
        self._data["vout"] = list()
        self._data["vin"] = list()
        for j in r.get("vin", []):
            tmp = dict()
            tmp["address"] = j.get("addr", "")
            tmp["value"] = j.get("valueSat", 0)
            self._data["vin"].append(tmp)
        for j in r.get("vout", []):
            tmp = dict()
            tmp["address"] = j.get("scriptPubKey", {}).get("addresses", [""])[0]
            tmp["value"] = currency_to_satoshi_cached(j.get("value", "0"), "btc")
            self._data["vout"].append(tmp)
        return self._response()

    def get_action_block(self):
        url = "{}/latestblock".format(self.URL)
        try:
            r = requests.get(url).json()
            height = r.get("height", 0)
        except Exception as e:
            logger.error("requests lateblock error{}".format(e))
            return self._response(error_msg.SERVER_ERROR)
        self._data = height
        return self._response()

    def post_action_decode_tx(self):
        if not self.check_input_arguments(["tx_hex"]):
            return self._response(error_msg.PARAMS_ERROR)
        url = "https://live.blockcypher.com/btc/decodetx/"
        try:
            r = requests.post(url, data={
                "tx_hex": self._input["tx_hex"],
                "coin_symbol": "btc",
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
