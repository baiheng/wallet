# -*-coding:utf-8-*-

import os

SETTINGS = os.environ.get('SETTINGS', '')

if SETTINGS == "PRODUCTION":
    from . import settings_production
    settings = settings_production.BaseConfig()
else:
    from . import settings_local
    settings = settings_local.LocalConfig()
