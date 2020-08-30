def format_char_1(string: str):
    string=string.split(' ')
    string=list(map(lambda s:s[0].upper()+s[1:].lower(), string))
    return string


print(format("dgfsfg ghshgsga ghs ghsg ghsdsjhjhh43478 hjdh"))
