import json
import re
import shlex
from collections import defaultdict
from typing import Dict
import requests
import urllib

from util import remove_comments, is_url


def get_prefixes(query: str):
    prefixes = {}
    prefix_pattern = re.compile(
        r'prefix\s+(?P<name>[^\s\n]+)\s+<(?P<uri>[^\s\n]+)>\s*\n',
        re.IGNORECASE | re.MULTILINE | re.DOTALL)
    for name, uri in prefix_pattern.findall(query):
        prefixes[name] = uri

    return prefixes


def get_select_variables(query: str):
    """
    List of variables used in the SELECT statement of the query
    :param query:
    :return:
    """
    select_pattern = re.compile(
        r'select\s+(distinct\s+)?(?P<variables>.+)\n*(from|where)',
        re.MULTILINE | re.IGNORECASE | re.DOTALL)
    select_statement = select_pattern.search(query)
    print(select_statement)
    if not select_statement:
        return []

    line = select_statement.group('variables')
    names = [token.replace('?', '')
             for token in shlex.split(line) if token.startswith('?')]
    return names


def is_sparql_variable(s: str):
    return s.startswith('?')


def variable_name(var: str):
    return var.replace('?', '')


def get_class_properties(*, query, var_class):
    """
    Get the properties and their variables for each class
    :param var_class:
    :param query:
    :return:
    """
    classes = defaultdict(dict)

    conditions = get_where_clause(query)
    if not conditions:
        return classes

    statement_pattern = re.compile(
        r'\n*\s*\?(?P<var1>\w*)\s+(?P<properties>[^.]*)\s*\.\s*\n*',
        re.IGNORECASE | re.MULTILINE | re.DOTALL)

    statements = statement_pattern.findall(conditions)

    for var1, properties in statements:
        # print(var1, '->\n', properties)
        pairs = [shlex.split(s.strip()) for s in properties.strip().split(';')]
        # print('pairs: ', pairs)
        for prop, obj in pairs:
            # print('line:', line)
            if prop in ['rdf:type', 'a', 'owl:type']:
                continue
            if is_sparql_variable(obj) and var1 in var_class:
                classes[var_class[var1]][prop] = variable_name(obj)

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
    if not is_url(uri):
        return None
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


def is_functional_property(*, prop_uri: str, api: str, repository: str):
    if not is_url(prop_uri):
        return False
    types = get_types(uri=prop_uri, api=api, repository=repository)

    return 'FunctionalProperty' in list(map(remove_prefix, types))


def is_key_property(*, prop_uri: str, api: str, repository: str):
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


def get_where_clause(query: str):
    pattern = re.compile(r'\s*where\s*\{\s*(?P<conditions>.*)\s*\}\s*',
                         re.IGNORECASE | re.MULTILINE | re.DOTALL)
    return max(pattern.findall(query), key=len)


def get_variable_types(*, query, prefixes, api, repository):
    var_type = {}
    var_class = {}
    var_prop = {}

    conditions = get_where_clause(query)
    if not conditions:
        return var_type, var_class

    statement_pattern = re.compile(
        r'\n*\s*\?(?P<var1>\w*)\s+(?P<properties>[^\.]*)\s*\.\s*\n*',
        re.IGNORECASE | re.MULTILINE | re.DOTALL)

    statements = statement_pattern.findall(conditions)

    for var1, properties in statements:
        pairs = [shlex.split(s.strip()) for s in properties.strip().split(';')]

        for prop, obj in pairs:
            # print('line:', line)
            if prop in ['rdf:type', 'a', 'owl:type']:
                class_ = get_full_uri(uri=obj,
                                      prefixes=prefixes)
                var_class[var1] = class_
                continue

            if is_sparql_variable(obj):
                var2 = variable_name(obj)
                # print('prop: ', prop)
                # print('var2: ', var2)
                prop_uri = get_full_uri(uri=prop, prefixes=prefixes)
                if not prop_uri:
                    continue

                var_prop[var2] = prop_uri

                metadata = get_metadata(uri=prop_uri, api=api,
                                        repository=repository)

                var_type[var2] = metadata['range']
                if var1 not in var_class:
                    var_type[var1] = metadata['domain']

    return var_type, var_class, var_prop


def variable_categories(*, var_type, variables, var_class, var_prop, api,
                        repository) -> Dict:
    """
    Returns the variables of different categories
    :param repository:
    :param api:
    :param var_prop:
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
        if is_key_property(prop_uri=var_prop[var], api=api,
                           repository=repository):
            var_categories['key'].append(var)
            continue
        if var in var_type:
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
        for prop in prop_vars:
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
                            class_properties=class_properties)) != 1:
        return {'match': False}

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

    return {'match': True,
            'pattern': 'Class with data properties',
            'variables': var_categories,
            'visualisations': visualisations}


def two_classes_linked_by_func_prop(*, query, select_variables,
                                    class_properties,
                                    var_categories, var_class,
                                    prefixes, api, repository) -> Dict:
    visualisations = []
    if len(get_classes_used(select_variables=select_variables,
                            class_properties=class_properties)) != 2:
        return {'match': False}

    conditions = get_where_clause(query)
    if not conditions:
        return {}
    statement_pattern = re.compile(
        r'\n*\s*\?(?P<sub>\w*)\s+(?P<properties>[^\.]*)\s*\.\s*\n*',
        re.IGNORECASE | re.MULTILINE | re.DOTALL)

    statements = statement_pattern.findall(conditions)
    # print('var_class: ', var_class)
    var1 = var2 = None
    for sub, properties in statements:
        if sub not in var_class:
            continue
        pairs = [shlex.split(s.strip()) for s in properties.strip().split(';')]

        for prop, obj in pairs:

            if prop in ['rdf:type', 'a', 'owl:type']:
                continue

            if is_sparql_variable(obj):
                if variable_name(obj) not in var_class:
                    continue
                print(sub, prop, obj)
                prop_uri = get_full_uri(uri=prop, prefixes=prefixes)
                if not prop_uri:
                    continue
                if is_functional_property(
                        prop_uri=get_full_uri(uri=prop_uri, prefixes=prefixes),
                        api=api, repository=repository):
                    var1, var2 = sub, obj
                    break

    if not var1 and not var2:
        return {'match': False}

    class_a_prop_var = class_properties[var_class[var1]].values()
    class_a_key = any(map(lambda var: var in var_categories['key'],
                          class_a_prop_var))
    class_b_prop_var = class_properties[var_class[var2]].values()
    class_b_key = any(map(lambda var: var in var_categories['key'],
                          class_b_prop_var))

    if class_a_key and class_b_key:
        visualisations.append({'name': 'Hierarchy Tree'})

        if len(var_categories['scalar']) >= 1:
            visualisations.append({'name': 'Tree Map'})
            visualisations.append({'name': 'Sunburst'})
            visualisations.append({'name': 'Circle Packing'})

    return {'match': True,
            'pattern': 'Two classes linked by functional property',
            'variables': var_categories,
            'visualisations': visualisations}


def query_analysis(query: str, api: str, repository):
    query = remove_comments(query)
    # Prefixes defined in query
    prefixes = get_prefixes(query)
    var_type, var_class, var_prop = get_variable_types(query=query,
                                                       prefixes=prefixes,
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
                                         var_class=var_class,
                                         var_prop=var_prop,
                                         api=api, repository=repository)
    for c in var_categories:
        var_categories[c] = sorted(var_categories[c],
                                   key=lambda var: select_variables.index(var))

    res = class_with_data_properties(select_variables=select_variables,
                                     class_properties=class_properties,
                                     var_categories=var_categories)
    if res['match']:
        return res

    res = two_classes_linked_by_func_prop(query=query,
                                          select_variables=select_variables,
                                          class_properties=class_properties,
                                          var_categories=var_categories,
                                          var_class=var_class,
                                          prefixes=prefixes,
                                          api=api, repository=repository)
    if res['match']:
        return res
    # print(var_categories)
    return {'match': False, 'variables': var_categories, 'visualisations': []}


if __name__ == '__main__':
    # from app import API_URL

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
    # triplet_pattern = re.compile(
    #     r'\s*\?(\w*)\s[^.]*([^;\n\s]*)\s[^.]*\?(\w*)\s*\.',
    #     re.IGNORECASE | re.MULTILINE | re.DOTALL)
    # print(triplet_pattern.findall(example_query))

    print(get_select_variables(example_query))
    # print(query_analysis(query=example_query,
    #                      api=API_URL,
    #                      repository='mondial'))
