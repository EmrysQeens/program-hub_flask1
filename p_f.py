import re
import json


# Validates name
def name_(name):
    return json.dumps({'stat': re.match(
        r'^[a-z A-Z][^0-9][^~`!@#$%^&*(){}\[\];:\"\'<,.>?/\\|_+=-]* [a-z A-Z][^0-9][^~`!@#$%^&*(){}\[\];:\"\'<,.>?\/\\|_+=-]*$',
        name) is not None})


# Validates mail
def email_(email):
    return json.dumps({'stat': re.match(r"(^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$)", email) is not None})


# Converts all letters after a whitespace to UpperCase
f_strip = lambda string: string.strip().title()
# Converts all letters after a whitespace to UpperCase
g_strip = lambda string: string.strip().capitalize()
# Returns query after stripping out 'is:(err|title) '
rm = lambda string: string[re.search(r'is:(err|title) ', string).span()[1]:]


def search():
    pass
