import csv
import json
import io
import shlex
import re

def csv_to_json(string):
    reader = csv.DictReader(io.StringIO(string))
    return json.dumps(list(reader))


def parse_csv_text(string: str, skip_header=True) -> [[str]]:
    string = string.replace('\r', '')
    rows = csv.reader(string.splitlines())
    header = next(rows)
    if skip_header:
        return list(rows)

    return {'header': header, 'data': list(rows)}


def is_csv(string):
    return ',' in string


def is_ntriples_format(result: str) -> bool:
    if result == '':
        return False

    lines = result.split('\n')

    return lines[0][-1] == '.' and len(lines[0].split(' ')) == 4


def remove_brackets(text):
    if len(text) >= 2:
        if (text[0], text[-1]) == ('<', '>'):
            return text[1:-1]
    return text


def parse_ntriples_graph(result: str) -> [[str]]:
    triplets: [[str, str, str]] = list(map(
        lambda line: list(map(remove_brackets, shlex.split(line))),
        result.strip().split('.\n')))

    return triplets


def is_blank_node(uri: str):
    return uri.startswith('_:')


def remove_blank_nodes(uris: [str]):
    return list(filter(lambda uri: not is_blank_node(uri), uris))


def is_json(myjson):
    try:
        json.loads(myjson)
    except ValueError as e:
        return False
    return True


def remove_comments(code):
    code = str(code)
    return re.sub(r'(?m)^ *#.*\n?', '', code)
