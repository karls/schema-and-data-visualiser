import json
import shlex
from collections import defaultdict
import parse
from typing import Dict
import requests
import urllib

from util import remove_comments, is_url


def get_prefixes(query: str):
    prefixes = {}
    for res in parse.findall('PREFIX {prefix} <{uri}>\n', query):
        fields = res.named
        prefixes[fields['prefix'].strip()] = fields['uri'].strip()

    return prefixes


def get_select_variables(query: str):
    """
    List of variables used in the SELECT statement of the query
    :param query:
    :return:
    """
    select_statement = parse.search('select {line}\nfrom', query) or \
        parse.search('select {line}\nwhere', query)

    if not select_statement:
        return []
    line = select_statement['line'].strip()
    variables = [token.replace('?', '')
                 for token in shlex.split(line) if token.startswith('?')]
    return variables


def get_class_variables(query) -> Dict[str, str]:
    """
    Get the class of the variables
    :param query:
    :return:
    """
    where_clause = \
        parse.search('where {{{conditions}}}', query)
    if not where_clause:
        return {}

    conditions = where_clause['conditions'].strip()
    class_var = {}

    results = list(parse.findall('?{var} rdf:type {class};', conditions)) + \
              list(parse.findall('?{var} rdf:type {class}.', conditions))

    for res in results:
        fields = res.named
        class_var[fields['var'].strip()] = fields['class'].strip()

    return class_var


def get_class_properties(*, query, var_class):
    """
    Get the properties and their variables for each class
    :param var_class:
    :param query:
    :return:
    """
    classes = defaultdict(dict)
    for result in parse.findall('rdf:type {class};{properties}.', query):
        cls = result['class'].strip()
        classes[cls] = {}
        properties = result['properties']
        for pairs in properties.split(';'):
            tokens = [token for token in shlex.split(pairs.strip()) if token]
            [prop, var] = tokens
            classes[cls][prop] = var.replace('?', '')

    for var1 in var_class:
        for result in parse.findall(f'\n?{var1} {{properties}}.', query):
            properties = result['properties']
            for pairs in properties.split(';'):
                tokens = [token for token in shlex.split(pairs.strip())
                          if token]
                # print('tokens: ', tokens)
                [prop, var2] = tokens

                if prop in ['rdf:type', 'a', 'owl:type']:
                    continue
                classes[var_class[var1]][prop] = var2.replace('?', '')

    return classes


def remove_prefix(uri: str, prefix=None) -> str:
    """
    Remove the prefix of a URI
    :param uri:
    :param prefix:
    :return:
    """
    if not uri:
        return ''
    if prefix:
        return uri.replace(prefix, '')

    return uri.split('/')[-1].split('#')[-1]


def get_full_uri(*, uri: str, prefixes) -> str:
    """
    Substitute the prefix back to get the original URI
    :param uri:
    :param prefixes:
    :return:
    """
    for prefix in prefixes:
        if is_url(uri):
            return uri
        uri = uri.replace(prefix, prefixes[prefix])

    return uri


def get_types(*, uri: str, api: str, repository: str):
    with open('queries/get_type.sparql', 'r') as query:
        encoded = urllib.parse.quote(query.read().format(uri=uri), safe="")
        response = requests.get(
            f'{api}/repositories/{repository}'
            f'?query={encoded}')

    return response.text.replace('\r', '').splitlines()[1:]


def get_metadata(*, uri: str, api: str, repository: str):
    """
    Returns metadata of a property
    :param uri:
    :param api:
    :param repository:
    :return:
    """
    with open('queries/meta_information.sparql', 'r') as query:
        encoded_query = urllib.parse.quote(
            query.read().format(uri=uri), safe="")
        response = requests.get(
            f'{api}/repositories/{repository}'
            f'?query={encoded_query}')

    info = response.text.replace('\r', '')

    fields = info.split('\n')[0].split(',')
    values = info.split('\n')[1].split(',')

    return dict(zip(fields, values))


def is_data_property(*, prop_uri: str, api: str, repository: str):
    types = get_types(uri=prop_uri, api=api, repository=repository)

    return 'DatatypeProperty' in list(map(remove_prefix, types))


def is_key(*, prop_uri: str, api: str, repository: str):
    """
    Check if property is a key of its class
    :param prop_uri:
    :param api:
    :param repository:
    :return:
    """
    types = list(map(remove_prefix,
                     get_types(uri=prop_uri, api=api, repository=repository)))
    metadata = get_metadata(uri=prop_uri, api=api, repository=repository)
    # print(prop_uri, metadata)
    prop_range = remove_prefix(metadata['range'])

    return 'InverseFunctionalProperty' in types or \
           prop_range == 'string' and 'FunctionalProperty' in types


def type_category(*, type_uri) \
        -> [str]:
    """
    Returns the category of the range of a property
    :param type_uri:
    :return:
    """

    categories = {
        'key': ['key'],
        'scalar': ['int', 'integer', 'decimal', 'negativeInteger',
                   'nonNegativeInteger'],
        'temporal': ['gDay', 'gYear', 'time', 'gMonth', 'gMonthDay',
                     'gYearMonth'],
        'date': ['date'  'dateTime'],
        'lexical': ['string'],
        'geographical': []
    }
    type_name = remove_prefix(type_uri)
    for c in categories:
        if type_name in categories[c]:
            return c

    return 'object'


def get_variable_types(*, query, prefixes, api, repository):
    var_type = {}
    class_var = {}
    where_clause = \
        parse.search('where {{{conditions}}}', query)
    if not where_clause:
        return var_type, class_var

    conditions = where_clause['conditions'].strip()
    statements = list(parse.findall('?{var} {text}.', conditions))

    for result in statements:
        var1 = result['var'].strip()
        text = result['text']
        lines = [s.strip() for s in text.strip().split(';')]

        for line in lines:
            # print('line:', line)
            tokens = shlex.split(line)
            prop = tokens[0]
            if prop in ['rdf:type', 'a', 'owl:type']:
                class_name = tokens[1]
                class_var[var1] = get_full_uri(uri=class_name,
                                               prefixes=prefixes)
                continue

            if tokens[1].startswith('?'):
                var2 = tokens[1].replace('?', '')
                # print('prop: ', prop)
                # print('var2: ', var2)
                prop_uri = get_full_uri(uri=prop, prefixes=prefixes)

                if is_key(prop_uri=prop_uri, api=api, repository=repository):
                    var_type[var2] = 'key'
                    continue

                metadata = get_metadata(uri=prop_uri, api=api,
                                        repository=repository)
                var_type[var2] = metadata['range']
                if var1 not in class_var:
                    var_type[var1] = metadata['domain']

    return var_type, class_var


def variable_categories(*, var_type, variables, var_class) -> Dict:
    """
    Returns the variables of different categories
    :param var_class:
    :param variables:
    :param var_type:
    :return:
    """
    var_categories = {
        'key': [],
        'scalar': [],
        'temporal': [],
        'geographical': [],
        'lexical': [],
        'date': [],
        'object': []
    }

    for var in variables:
        if var in var_class:
            var_categories['object'].append(var)
            continue
        # print(var_class, var_type)
        type_name = var_type[var]
        catg = type_category(type_uri=type_name)
        var_categories[catg].append(var)

    return var_categories


def get_classes_used(select_variables, class_properties) -> [str]:
    """
    Returns the number of classes that the select variables belong to
    :param select_variables:
    :param class_properties:
    :return:
    """
    used = set()
    for cls in class_properties:
        prop_vars = class_properties[cls]
        for prop in class_properties[cls]:
            if prop_vars[prop] in select_variables:
                used.add(cls)

    return list(used)


def property_links_classes(prop_uri: str, class_a, class_b, api, repository) \
        -> bool:
    with open('queries/get_type.sparql', 'r') as query:
        encoded_query = urllib.parse.quote(
            query.read().format(property=prop_uri, classA=class_a,
                                classB=class_b), safe="")
        response = requests.get(
            f'{api}/repositories/{repository}'
            f'?query={encoded_query}')

        result = json.loads(response.text)

    return result['boolean']


def class_with_data_properties(*, select_variables, class_properties,
                               var_categories) -> Dict:
    visualisations = []
    if len(get_classes_used(select_variables=select_variables,
                            class_properties=class_properties)) > 1:
        return {'valid': False}

    # print(var_categories)
    if len(var_categories['key']) == 1 and len(var_categories['scalar']) >= 1:
        visualisations.append({'name': 'Bar', 'maxInstances': 100})

    if len(var_categories['scalar']) >= 2:
        visualisations.append({'name': 'Scatter'})

    if len(var_categories['scalar']) >= 3:
        visualisations.append({'name': 'Bubble'})

    if len(var_categories['date']) >= 1 and var_categories['scalar'] >= 1:
        visualisations.append({'name': 'Calendar'})

    if len(var_categories['geographical']) == 1 \
            and len(var_categories['scalar']) >= 1:
        visualisations.append({'name': 'Choropleth Map'})

    if len(var_categories['key']) == 1 and len(var_categories['scalar']) >= 1:
        visualisations.append({'name': 'Word Cloud'})

    return {'valid': True,
            'pattern': 'Class with data properties',
            'variables': var_categories,
            'visualisations': visualisations}


def query_analysis(query: str, api: str, repository):
    query = remove_comments(query)
    # Prefixes defined in query
    prefixes = get_prefixes(query)
    var_type, var_class = get_variable_types(query=query, prefixes=prefixes,
                                             api=api,
                                             repository=repository)
    # print('var_type', var_type)
    # return
    # Variables that will be returned
    select_variables = get_select_variables(query)
    # All classes used in the WHERE clause
    class_properties = get_class_properties(query=query, var_class=var_class)
    # Checks if a variable from a class has already been used

    var_categories = variable_categories(var_type=var_type,
                                         variables=select_variables,
                                         var_class=var_class)
    res = class_with_data_properties(select_variables=select_variables,
                                     class_properties=class_properties,
                                     var_categories=var_categories)
    if res['valid']:
        return res
    # print(var_categories)
    return {'valid': False, 'variables': var_categories, 'visualisations': []}


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
    print(query_analysis(query=example_query,
                         api=API_URL,
                         repository='mondial'))
