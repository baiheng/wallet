#!/bin/env python
# -*- coding:utf8 -*-

from sqlalchemy import Column, String, Integer, DateTime, text

from common.sqlalchemy_ctl import Base
from common.utility import create_table

from conf import settings


class Btc(Base):
    __tablename__ = 'coin_btc'
    id = Column(Integer(), primary_key=True, autoincrement=True)
    name = Column(String(50), nullable=False, server_default='')
    password = Column(String(50), nullable=False, server_default='')
    phone = Column(String(50), nullable=False, server_default='')
    create_time = Column(DateTime, nullable=False, server_default=text('CURRENT_TIMESTAMP'))


if settings.CREATE_TABLE:
    #create_table("coin_btc")
    pass
