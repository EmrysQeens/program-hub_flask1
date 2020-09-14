import smtplib
import base64
import re

# people = [
#     {'name': 'David',
#      'gender': 'Male'},
#     {'name': 'David',
#      'gender': 'Male'},
#     {'name': 'David',
#      'gender': 'Male'},
#     {'name': 'David',
#      'gender': 'Male'},
#     {'name': 'David',
#      'gender': 'Male'},
#     {'name': 'David',
#      'gender': 'Male'},
# ]
#
# x=[name['name'] for name in people]
#
# print(x)

regex=r'^is:(err|title) [0-9 A-Z a-z]*$'

print(re.match(regex, 'is:err Jbkjh'))