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


def convert_graph_to_list(string: str) -> [[str]]:
    return list(map(lambda line: line.replace('.', '').strip().split(' '),
                    string.splitlines()))
