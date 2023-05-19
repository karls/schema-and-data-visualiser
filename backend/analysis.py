import parse
from typing import Dict
import requests
import urllib


def get_prefixes(query: str):
    prefixes = {}
    for res in parse.findall('PREFIX {prefix} <{uri}>\n', query):
        fields = res.named
        prefixes[fields['prefix']] = fields['uri']

    return prefixes


def get_select_variables(query: str):
    select_statement = parse.search('select {line}\n', query)
    if not select_statement:
        return []
    line = select_statement['line']
    variables = [token.replace('?', '')
                 for token in line.split() if token.startswith('?')]
    return variables


def get_class_variables(query) -> Dict[str, str]:
    where_clause = \
        parse.search('where {{\n{conditions}\n}}', query)
    if not where_clause:
        return {}

    classes = {}
    for res in parse.findall('?{var} rdf:type {class} ;', where_clause):
        if res is not None:
            fields = res.named
            classes[fields['var']] = fields['class']

    return classes


def get_class_properties(query):
    classes = {}
    for result in parse.findall('rdf:type {class} ;\n{properties} .', query):
        cls = result['class']
        classes[cls] = {}
        properties = result['properties']
        for pairs in properties.split(';'):
            [prop, var] = pairs.strip().split()
            classes[cls][prop] = var.replace('?', '')

    return classes


def remove_prefix(uri: str, prefix=None) -> str:
    if not uri:
        return ''
    if prefix:
        return uri.replace(prefix, '')

    return uri.split('/')[-1].split('#')[-1]


def get_full_uri(s: str, prefixes) -> str:
    for prefix in prefixes:
        s = s.replace(prefix, prefixes[prefix])

    return s


def get_types(*, uri: str, api: str, repository: str):
    with open('queries/get_type.sparql', 'r') as query:
        response = requests.get(
            f'{api}/repositories/{repository}'
            f'?query={urllib.parse.quote(query.read().format(uri=uri), safe="")}')

    return response.text.replace('\r', '').splitlines()[1:]


def get_metadata(*, uri: str, api: str, repository: str):
    with open('queries/meta_information.sparql', 'r') as query:
        response = requests.get(
            f'{api}/repositories/{repository}'
            f'?query={urllib.parse.quote(query.read().format(uri=uri), safe="")}')

    info = response.text

    fields = info.split('\n')[0].split(',')
    values = info.split('\n')[1].split(',')

    return dict(zip(fields, values))


def is_data_property(*, prop_uri: str, api: str, repository: str):
    types = get_types(uri=prop_uri, api=api, repository=repository)

    return 'DatatypeProperty' in list(map(remove_prefix, types))


def is_key(*, prop_uri: str, api: str, repository: str):
    types = list(map(remove_prefix,
                     get_types(uri=prop_uri, api=api, repository=repository)))
    metadata = get_metadata(uri=prop_uri, api=api, repository=repository)
    prop_range = remove_prefix(metadata['range'])

    return prop_range == 'string' and 'FunctionalProperty' in types


def property_range_type(*, prop_uri: str, api: str, repository: str) -> str:
    metadata = get_metadata(uri=prop_uri, api=api, repository=repository)
    prop_range = remove_prefix(metadata['range'])

    types = {
        'scalar':
            ['int', 'integer', 'decimal', 'negativeInteger',
             'nonNegativeInteger'],
        'temporal':
            ['date', 'dateTime', 'gDay', 'gYear', 'time', 'gMonth', 'gMonthDay',
             'gYearMonth'],
        'lexical': ['string'],
        'geographical': []
    }
    for t in types:
        if prop_range in types[t]:
            return t
    return 'object'


def variable_categories(*, query, api: str, repository: str) -> Dict:
    # Prefixes defined in query
    prefixes = get_prefixes(query)
    # Variables that will be returned
    select_variables = get_select_variables(query)
    # All classes used in the WHERE clause
    all_classes = get_class_properties(query)
    # Checks if a variable from a class has already been used
    key_var = None

    var_categories = {
        'scalar': [],
        'temporal': [],
        'geographical': [],
        'lexical': []
    }

    for cls in all_classes:
        for prop in all_classes[cls]:
            var = all_classes[cls][prop]
            if var in select_variables:

                # Each property to a variable has to be a Datatype property
                if not is_data_property(prop_uri=get_full_uri(prop, prefixes),
                                        api=api, repository=repository):
                    return {'valid': False}

                prop_uri = get_full_uri(prop, prefixes)

                if is_key(prop_uri=get_full_uri(prop, prefixes),
                          api=api, repository=repository):
                    if key_var:
                        return {'valid': False}
                    key_var = var
                    continue

                prop_range_t = property_range_type(prop_uri=prop_uri,
                                                   api=api,
                                                   repository=repository)
                var_categories[prop_range_t].append(var)

    var_categories['keyVar'] = key_var

    return var_categories


def class_with_data_properties(*, query, api: str, repository: str) \
        -> Dict:
    var_categories = variable_categories(query=query, api=api, repository=repository)

    visualisations = []

    if var_categories['keyVar'] and len(var_categories['scalar']) >= 1:
        visualisations.append({'name': 'Bar', 'maxInstances': 100})

    if len(var_categories['scalar']) >= 2:
        visualisations.append({'name': 'Scatter'})

    if len(var_categories['scalar']) >= 3:
        visualisations.append({'name': 'Bubble'})

    if len(var_categories['temporal']) >= 1:
        visualisations.append({'name': 'Calendar'})

    if len(var_categories['geographical']) == 1 \
            and len(var_categories['scalar']) >= 1:
        visualisations.append({'name': 'Choropleth Map'})

    if var_categories['keyVar'] and len(var_categories['scalar']) >= 1:
        visualisations.append({'name': 'Word Cloud'})

    return {'valid': True,
            'pattern': 'Class with data properties',
            'keyVar': var_categories['keyVar'],
            'scalarVars': var_categories['scalar'],
            'temporalVars': var_categories['temporal'],
            'geographicalVars': var_categories['geographical'],
            'lexicalVars': var_categories['lexical'],
            'visualisations': visualisations}


def query_analysis(query: str, api: str, repository):
    res = class_with_data_properties(query=query, 
                                     api=api, 
                                     repository=repository)
    if res['valid']:
        return res

    return {'valid': False}


if __name__ == '__main__':
    from app import API_URL

    example_query = '''
PREFIX rdfs: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>
PREFIX : <http://www.semwebtech.org/mondial/10/meta#>
SELECT ?inflation ?unemployment
WHERE {
  ?c rdf:type :Country ;
    :inflation ?inflation ;
    :unemployment ?unemployment .
}
    '''
    # print(patterns[0]['query'].replace('\t', ''))
    #
    # print(query.replace('\t', ''))
    # print(parse.parse(patterns[0]['query'].replace('\t', ''),
    #                   query.replace('\t', '')))
    # print(get_prefixes(example_query))
    # print(get_select_variables(example_query))
    # print(get_class_variables(example_query))
    # print(get_class_properties(example_query))
    print(class_with_data_properties(query=example_query,
                                     api=API_URL,
                                     repository='mondial'))
