import csv
import json
import io


def csv_to_json(string):
    reader = csv.DictReader(io.StringIO(string))
    return json.dumps(list(reader))


def csv_to_list(string: str, header=True) -> [[str]]:
    rows = csv.reader(string.splitlines())
    if header:
        next(rows)

    return list(rows)


def is_csv(string):
    return ',' in string


def remove_brackets(text):
    if len(text) >= 2:
        if (text[0], text[-1]) == ('<', '>'):
            return text[1:-1]
    return text


def convert_graph_to_list(string: str) -> [[str]]:
    triplets: [[str, str, str]] = list(map(
        lambda line: list(map(remove_brackets, line.split(' '))),
        string.split('.\n')[:-1]))

    return triplets
