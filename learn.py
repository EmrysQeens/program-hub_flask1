import re


def match(s: str):
    return re.match(r'\s', s) is None


# trims whitespaces in text
def trim(string: str):
    trimmed: str = ''
    for i in range(len(string)):
        if match(string[i]):
            trimmed += string[i]
        else:
            try:
                if not match(string[i]) and trimmed[len(trimmed) - 1] != ' ':
                    trimmed += ' '
            except IndexError:
                continue
    return trimmed


def trim_(string: str):
    matches: list = re.findall(r'<\s*/?\s*\w?\s*[\s*\w?\s*=?\s*"?\'?\s*\w?[\w\-?\w?\s*:?\s*\w\-?\w?;?\s*]*"?\'?]*>',
                               string)
    for mtch in matches:
        string = string.replace(mtch, '')
    return string
