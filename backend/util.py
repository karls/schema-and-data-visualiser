import csv
import json
import io


def csv_to_json(string):
    reader = csv.DictReader(io.StringIO(string))
    return json.dumps(list(reader))


def parse_csv_text(string: str, header=True) -> [[str]]:
    string = string.replace('\r', '')
    rows = csv.reader(string.splitlines())
    if header:
        next(rows)

    return list(rows)


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
        lambda line: list(map(remove_brackets, line.split(' '))),
        result.strip().split('.\n')))

    return triplets
