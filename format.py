import re
import json


def name_(name):
    return json.dumps({'stat': re.match(
        r'^[a-z A-Z][^0-9][^~`!@#$%^&*(){}\[\];:\"\'<,.>?\/\\|_+=-]* [a-z A-Z][^0-9][^~`!@#$%^&*(){}\[\];:\"\'<,.>?\/\\|_+=-]*$',
        name) is not None})


def email_(email):
    return json.dumps({'stat': re.match(r"(^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$)", email) is not None})


def format_(text):
    return list(map(lambda x: x.capitalize(), text.split(' ')))


f_strip = lambda string: string.strip().title()
