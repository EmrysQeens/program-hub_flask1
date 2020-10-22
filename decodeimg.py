from base64 import b64decode
from re import search
import json
import os

path: str = 'images/learn/'
path_to_json = 'images/learn/extension.json'


def decode(title: str, b64string: str):
    indices: tuple = (search(r'/\w+;', b64string[:21]).span(), search(r',[\w +/=]+', b64string).span())
    ext: str = b64string[indices[0][0] + 1: indices[0][1] - 1]
    byt: bytes = b64decode(b64string[indices[1][0] + 1: indices[1][1]])
    open(f'{path}{title}.{ext}', 'wb').write(byt)
    extensions = json.loads(open(path_to_json, 'r').read())
    extensions[title] = ext
    open(path_to_json, 'w').write(str(json.dumps(extensions, indent=4)))


def ext_(title: str) -> str:
    extensions = json.loads(open(path_to_json, 'r').read())
    if title in extensions:
        return extensions[title]


def clear(title: str):
    path_: str = 'images/learn/{}.{}'.format(title, ext_(title))
    if os.path.exists(path_):
        os.remove(path_)
    extensions: dict = json.loads(open(path_to_json, 'r').read())
    if title in extensions:
        extensions.pop(title)
        open(path_to_json, 'w').write(str(json.dumps(extensions, indent=4)))

