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
    """
    List of variables used in the SELECT statement of the query
    :param query:
    :return:
    """
    select_statement = parse.search('select {line}\n', query)
    if not select_statement:
        return []
    line = select_statement['line']
    variables = [token.replace('?', '')
                 for token in line.split() if token.startswith('?')]
    return variables


def get_class_variables(query) -> Dict[str, str]:
    """
    Get the class of the variables
    :param query:
    :return:
    """
    where_clause = \
        parse.search('where {{\n{conditions}\n}}', query)
    if not where_clause:
        return {}
    conditions = where_clause['conditions']
    class_var = {}
    for res in parse.findall('?{var} rdf:type {class} ;', conditions):
        if res is not None:
            fields = res.named
            class_var[fields['var']] = fields['class']

    return class_var


def get_class_properties(query):
    """
    Get the properties and their variables for each class
    :param query:
    :return:
    """
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


def get_full_uri(s: str, prefixes) -> str:
    """
    Substitute the prefix back to get the original URI
    :param s:
    :param prefixes:
    :return:
    """
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
    """
    Returns metadata of a property
    :param uri:
    :param api:
    :param repository:
    :return:
    """
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
    prop_range = remove_prefix(metadata['range'])

    return 'InverseFunctionalProperty' in types or \
           prop_range == 'string' and 'FunctionalProperty' in types


def property_range_categories(*, prop_uri: str, api: str, repository: str) \
        -> [str]:
    """
    Returns the category of the range of a property
    :param prop_uri:
    :param api:
    :param repository:
    :return:
    """
    metadata = get_metadata(uri=prop_uri, api=api, repository=repository)
    prop_range = remove_prefix(metadata['range'])

    categories = {
        'scalar':
            ['int', 'integer', 'decimal', 'negativeInteger',
             'nonNegativeInteger'],
        'temporal':
            ['date', 'dateTime', 'gDay', 'gYear', 'time', 'gMonth', 'gMonthDay',
             'gYearMonth'],
        'date': ['date'  'dateTime', 'time'],
        'lexical': ['string'],
        'geographical': []
    }
    prop_categories = []
    for c in categories:
        if prop_range in categories[c]:
            prop_categories.append(c)
    if not prop_categories:
        prop_categories.append('other')
    return prop_categories


def variable_categories(*, query, api: str, repository: str, select_variables,
                        all_classes, prefixes) -> Dict:
    """
    Returns the variables of different categories
    :param query:
    :param api:
    :param repository:
    :param select_variables:
    :param all_classes:
    :param prefixes:
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

    for cls in all_classes:
        for prop in all_classes[cls]:
            var = all_classes[cls][prop]
            if var in select_variables:
                prop_uri = get_full_uri(prop, prefixes)

                if is_key(prop_uri=get_full_uri(prop, prefixes),
                          api=api, repository=repository):
                    var_categories['key'].append(var)
                    continue

                prop_categories = property_range_categories(
                    prop_uri=prop_uri,
                    api=api,
                    repository=repository)

                for c in prop_categories:
                    var_categories[c].append(var)

    return var_categories


def get_classes_used(select_variables, all_classes) -> [str]:
    """
    Returns the number of classes that the select variables belong to
    :param select_variables:
    :param all_classes:
    :return:
    """
    used = set()
    for cls in all_classes:
        prop_vars = all_classes[cls]
        for prop in all_classes[cls]:
            if prop_vars[prop] in select_variables:
                used.add(cls)

    return used


def class_with_data_properties(*, query, api: str, repository: str,
                               select_variables, all_classes,
                               var_categories: Dict) -> Dict:
    class_var = get_class_variables(query)
    if len(get_classes_used(select_variables, all_classes)) != 1:
        return {'valid': False, 'variables': var_categories}

    visualisations = []

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
    # Prefixes defined in query
    prefixes = get_prefixes(query)
    # Variables that will be returned
    select_variables = get_select_variables(query)
    # All classes used in the WHERE clause
    all_classes = get_class_properties(query)
    # Checks if a variable from a class has already been used

    var_categories = variable_categories(query=query,
                                         api=api,
                                         repository=repository,
                                         select_variables=select_variables,
                                         prefixes=prefixes,
                                         all_classes=all_classes)
    res = class_with_data_properties(query=query,
                                     api=api,
                                     repository=repository,
                                     var_categories=var_categories,
                                     select_variables=select_variables,
                                     all_classes=all_classes)
    if res['valid']:
        return res

    return {'valid': False, 'variables': var_categories}


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
