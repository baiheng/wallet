#!/bin/bash
#===============================================================================
#
#          FILE:  test.sh
# 
#         USAGE:  ./test.sh 
# 
#   DESCRIPTION:  
# 
#       OPTIONS:  ---
#  REQUIREMENTS:  ---
#          BUGS:  ---
#         NOTES:  ---
#        AUTHOR:  chenbaiheng (), chenbaiheng@xunlei.com
#       COMPANY:  XunLei Networking Tech
#       VERSION:  1.0
#       CREATED:  04/25/2018 11:10:17 PM CST
#      REVISION:  ---
#===============================================================================

curl -il -H "Content-Type: application/json;" -X POST -d \
	'{"address": [{"type": "btc", "amount":10,"cny":100,"address":"btc123123131"},{"type": "eth", "amount":11,"cny":200,"address":"eth1adfa23123131"}], "userID": "1"}'\
	"http://127.0.0.1:18080/v1/api/user/address"
