from flask import json
from rdflib import Graph
import requests
import urllib

from backend.util import parse_ntriples_graph, parse_csv_text, \
    is_ntriples_format, is_json

BAD_REQUEST = 400


class RDFRepository:
    def __init__(self, *, name: str):
        self.name = name

    def run_query(self, *, query: str):
        pass


class LocalRepository(RDFRepository):
    def __init__(self, *, name: str, data_url: str, schema_url: str,
                 graph: Graph=None):
        super().__init__(name=name)
        self.graph = graph if graph else Graph()
        self.data_url = data_url
        self.schema_url = schema_url
        self.import_data()

    def import_data(self):
        formats = ['xml', 'nt', 'n3', 'ttl', 'turtle']
        if self.data_url:
            for ext in formats:
                try:
                    self.graph.parse(location=self.data_url, format=ext)
                    break
                except:
                    pass
        if self.schema_url:
            for ext in formats:
                try:
                    self.graph.parse(location=self.schema_url, format=ext)
                    break
                except:
                    pass

    def run_query(self, *, query: str):
        try:
            result = self.graph.query(query)

            header = [str(column) for column in result.vars]
            data = []

            for row in result:
                data.append([str(value) for value in row])

            return {'header': header, 'data': data}

        except Exception as e:
            return {'header': [['ERROR']], 'data': str(e)}


class GraphDBRepository(RDFRepository):
    def __init__(self, *, name, server):
        super().__init__(name=name)
        self.server = server

    def run_query(self, *, query: str):
        response = requests.get(
            f'{self.server}/repositories/{self.name}'
            f'?query={urllib.parse.quote(query, safe="")}')

        results = response.text.replace('\r', '')
        header = []
        data = []

        if response.status_code == BAD_REQUEST:
            header = ['ERROR']
            data = [[results]]

        elif is_json(results):  # For ASK queries
            obj = json.loads(results)
            if 'boolean' in obj:
                header = ['boolean']
                data = [[str(obj['boolean']).lower()]]

        elif is_ntriples_format(results):  # For CONSTRUCT queries
            header = ['Subject', 'Predicate', 'Object']
            data = parse_ntriples_graph(results)

        else:  # For SELECT queries
            header = results.split('\n')[0].split(',')
            data = parse_csv_text(results)

        return {'header': header, 'data': data}


if __name__ == '__main__':
    repo = LocalRepository(name="mondial",
                           data_url='https://www.dbis.informatik.uni-goettingen.de/Mondial/Mondial-RDF/mondial.n3',
                           schema_url='https://www.dbis.informatik.uni-goettingen.de/Mondial/Mondial-RDF/mondial-meta.n3')

    qry = '''
PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>
PREFIX : <http://www.semwebtech.org/mondial/10/meta#>

SELECT ?inflation ?unemployment
WHERE {
  ?c rdf:type :Country ;
    :name "India" ;
    :inflation ?inflation ;
    :unemployment ?unemployment .
}
    '''
    print(repo.run_query(query=qry))
