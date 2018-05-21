#!/bin/env python
# -*- coding:utf8 -*-

import json
import time
import traceback

from sanic import Sanic, response

from common.mylog import logger
from common import utility
from common import error_msg

from conf import settings


class BaseView(object):
    def __init__(self, *args, **kwargs):
        controller_obj = kwargs.get("controller_obj", None)
        if controller_obj != None:
            del kwargs["controller_obj"]
        self._request = args[0]
        self._user = None
        self._ret, self._msg = error_msg.SUCCESS
        self._data = {}
        self._resp_json = ""
        self._input = kwargs
        self._controller_obj = controller_obj
        self.__start_time = time.time()

    def dispatch(self, fun_name=None):
        self.get_input_arguments()
        try:
            if fun_name:
                func = getattr(self, fun_name, None)
                if func:
                    return func()
                else:
                    return self._response(error_msg.PARAMS_ERROR)
            if self._request.method == "GET":
                action = self._input.get("action", None)
                if action:
                    func = getattr(self, "get_action_%s" % action, None)
                    if func:
                        return func()
                    else:
                        return self._response(error_msg.PARAMS_ERROR)
                else:
                    return self.get()
            elif self._request.method == "POST":
                action = self._input.get("action", None)
                if action:
                    func = getattr(self, "post_action_%s" % action, None)
                    if func:
                        return func()
                    else:
                        return self._response(error_msg.PARAMS_ERROR)
                else:
                    return self.post()
            elif self._request.method == "PUT":
                return self.put()
            elif self._request.method == "DELETE":
                return self.delete()
        except Exception as e:
            traceback.print_exc()
            logger.error("dispatch method error: %s" % e)
        return self._response(error_msg.PARAMS_ERROR)

    def get(self,
            must_input=None,
            enable_input=None,
            disable_input=None,
            disable_output=None):

        if not self.check_input_arguments(must_input, enable_input, disable_input):
            return self._response(error_msg.PARAMS_ERROR)
        if self._controller_obj is not None:
            if self._do_get(disable_output=disable_output):
                self._ret, self._msg = error_msg.SUCCESS
            else:
                self._ret, self._msg = error_msg.SERVER_ERROR
            return self._response()
        else:
            self._ret, self._msg = error_msg.SERVER_ERROR
            return self._response()

    def _do_get(self, disable_output=None, transform_json=True):
        try:
            data, total = self._controller_obj.filter_item(**self._input)
            self._data["total"] = total
            if transform_json:
                self._data["list"] = utility.to_obj(data, without_fields=disable_output)
            else:
                self._data["list"] = data
            return True
        except Exception as e:
            traceback.print_exc()
            logger.error("get method error: %s" % e)
            return False

    def post(self,
             must_input=None,
             enable_input=None,
             disable_input=None):
        if not self.check_input_arguments(must_input, enable_input, disable_input):
            return self._response(error_msg.PARAMS_ERROR)
        if self._controller_obj is not None:
            if self._do_post():
                self._ret, self._msg = error_msg.SUCCESS
            else:
                self._ret, self._msg = error_msg.SERVER_ERROR
            return self._response()
        else:
            self._ret, self._msg = error_msg.SERVER_ERROR
            return self._response()

    def _do_post(self):
        try:
            if self._controller_obj.new_item(**self._input):
                return True
            else:
                logger.error("post method error")
                return False
        except Exception as e:
            self._ret, self._msg = error_msg.SERVER_ERROR
            logger.error("post method error: %s" % e)
            return False

    def put(self,
            must_input=None,
            enable_input=None,
            disable_input=None):
        if not self.check_input_arguments(must_input, enable_input, disable_input):
            return self._response(error_msg.PARAMS_ERROR)
        if self._controller_obj is not None:
            if self._do_put():
                self._ret, self._msg = error_msg.SUCCESS
            else:
                self._ret, self._msg = error_msg.SERVER_ERROR
            return self._response()
        else:
            self._ret, self._msg = error_msg.SERVER_ERROR
            return self._response()

    def _do_put(self):
        try:
            if self._controller_obj.update_item(**self._input):
                return True
            else:
                return False
        except Exception as e:
            logger.error("put method error: %s" % e)
            return False

    def delete(self,
               must_input=None,
               enable_input=None,
               disable_input=None):
        if not self.check_input_arguments(must_input, enable_input, disable_input):
            return self._response(error_msg.PARAMS_ERROR)
        if self._controller_obj is not None:
            if self._do_delete():
                self._ret, self._msg = error_msg.SUCCESS
            else:
                self._ret, self._msg = error_msg.SERVER_ERROR
            return self._response()
        else:
            self._ret, self._msg = error_msg.SERVER_ERROR
            return self._response()

    def _do_delete(self):
        try:
            if self._controller_obj.delete_item(**self._input):
                return True
            else:
                logger.error("delete method error")
                return False
        except Exception as e:
            logger.error("delete method error: %s" % e)
            return False

    def check_session(self):
        session = self._request.cookies.get("session_id", "")
        if session and self.decode_session(session):
            return True
        return False

    def decode_session(self, session):
        self._user = dict(uid=1)
        return True

    def _response(self, ret_msg=None, data=None):
        if not ret_msg is None:
            self._ret, self._msg = ret_msg
        if not data is None:
            self._data = data
        self._resp_json = json.dumps({
            "ret": self._ret,
            "msg": self._msg,
            "data": self._data
            })
        logger.info("finish %s, ip: %s, url: %s, "
                "method: %s, headers: %s, body: %s, cookie: %s "
                "resp: %s. handle time: %s ms" %
                (self.__class__.__name__,
                    self._request.remote_addr,
                    self._request.url,
                    self._request.method,
                    self._request.headers,
                    self._request.body.decode("utf-8"),
                    self._request.cookies,
                    self._resp_json,
                    (time.time() - self.__start_time)*1000
                    ))
        return response.text(
                self._resp_json,
                content_type="application/json")

    def set_input_arguments(self, key, value):
        self._input[key] = str(value)

    def get_input_arguments(self):
        # 获取url参数和json参数
        _input = dict()
        if self._request.method == "GET":
            _input = self._request.raw_args
        if self._request.content_type == "application/json":
            _input = self._request.json
        if (self._request.content_type == "application/x-www-form-urlencoded"
                or self._request.content_type == "multipart/form-data"):
            _input = self._request.form
        if len(self._input) != 0:
            _input.update(self._input)
        self._input = _input

    def check_input_arguments(self,
                              must_input=None,
                              enable_input=None,
                              disable_input=None):
        if must_input is None and enable_input is None and disable_input is None:
            return True
        s = set(self._input.keys())
        if must_input is not None:
            if not set(must_input) <= s:
                return False
        if enable_input is not None:
            y = set(enable_input)
            if not y <= s:
                return False
            s = y
        if disable_input is not None:
            s = s - set(disable_input)
        if enable_input is not None or disable_input is not None:
            self._input = {i: self._input.get(i, None) for i in s}
        return True
