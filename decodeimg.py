from base64 import b64decode
from re import search
import json


def decode(title: str, b64string: str):
    indices: tuple = (search(r'/\w+;', b64string[:21]).span(), search(r',[\w +/=]+', b64string).span())
    ext: str = b64string[indices[0][0] + 1: indices[0][1] - 1]
    byt: bytes = b64decode(b64string[indices[1][0] + 1: indices[1][1]])
    open(f'images/learn/{title}.{ext}', 'wb').write(byt)
    extensions = json.loads(open('images/learn/extension.json', 'r').read())
    extensions[title] = ext
    open('images/learn/extension.json', 'w').write(str(json.dumps(extensions, indent=4)))


def ext_(title: str) -> str:
    return json.loads(open('images/learn/extension.json', 'r').read())[title]
