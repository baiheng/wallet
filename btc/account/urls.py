#!/bin/env python
# -*-coding:utf-8-*-

from account.views.user_view import UserView

from account.controllers import user_obj


urls = [
    ("user", UserView, user_obj),
]
