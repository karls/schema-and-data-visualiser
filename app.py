import json
import os
from flask import Flask, request, jsonify, flash, send_from_directory, session
from werkzeug.utils import secure_filename
import requests
from flask_cors import CORS
import urllib
from dotenv import load_dotenv, find_dotenv
from backend.analysis import query_analysis, QUERY_PATH
from backend.db import save_query, get_queries, delete_all_queries, \
    save_repository, get_repository, get_repository_info
from backend.repository import LocalRepository, GraphDBRepository
from backend.util import csv_to_json, parse_csv_text, is_csv, \
    parse_ntriples_graph, is_ntriples_format, remove_blank_nodes, \
    is_blank_node, is_json

load_dotenv(find_dotenv())

UPLOAD_FOLDER = 'imports'

API_URL = os.environ['GRAPHDB_SERVER']
BUILD = os.environ['BUILD']

if BUILD == 'development':
    app = Flask(__name__)
    CORS(app, origins=["http://localhost:3000"])
else:
    app = Flask(__name__, static_url_path='', static_folder='frontend/build')

app.secret_key = 'imperial-college-london'
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
ALLOWED_EXTENSIONS = {'rdf', 'xml', 'nt', 'n3', 'ttl', 'nt11', 'txt'}

BAD_REQUEST = 400


@app.route("/", defaults={'path': ''})
def serve(path):
    return send_from_directory(app.static_folder, 'index.html')


def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS


@app.route('/repositories', methods=['GET'])
def get_repositories():
    if request.method == 'GET':
        username = request.args['username']
        return jsonify(get_repository_info(username=username))


@app.route('/upload', methods=['POST'])
def upload_file():
    if request.method == 'POST':
        # check if the post request has the file part
        if 'file' not in request.files:
            flash('No file part')
            return {}
        file = request.files['file']
        # If the user does not select a file, the browser submits an
        # empty file without a filename.
        if file.filename == '':
            flash('No selected file')
            return {}
        if file and allowed_file(file.filename):
            filename = secure_filename(file.filename)
            print(os.path.join(app.config['UPLOAD_FOLDER'], filename))
            if not os.path.isdir(UPLOAD_FOLDER):
                os.makedirs(UPLOAD_FOLDER)
            file.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))
            return {}


@app.route('/login', methods=['POST'])
def login():
    if request.method == 'POST':
        username = request.args['username']
        session['username'] = username
        print('username: ', session)
        return username


@app.route('/logout', methods=['POST'])
def logout():
    if request.method == 'POST':
        if 'username' in session:
            username = session['username']
            session.pop('username', None)
            return username
        return ''


@app.route('/repositories/local', methods=['POST'])
def add_local_repo():
    username = session['username']
    if request.method == 'POST':
        name = request.json['name']
        data_url = request.json['dataUrl']
        schema_url = request.json['schemaUrl']
        repo = LocalRepository(name=name, data_url=data_url,
                               schema_url=schema_url)
        save_repository(repository=repo, username=username)


@app.route('/repositories/graphdb', methods=['POST'])
def add_graphdb_repo():
    username = session['username']
    if request.method == 'POST':
        name = request.json['name']
        server = request.json['server']
        repo = GraphDBRepository(name=name, server=server)
        save_repository(repository=repo, username=username)


@app.route('/sparql', methods=['GET'])
def run_query():
    if request.method == 'GET':
        repository_id = request.args['repository']
        query = request.args['query']
        username = request.args['username']

        repository = get_repository(repository_id=repository_id,
                                    username=username)

        return repository.run_query(query=query)


@app.route('/saved-queries', methods=['GET', 'POST', 'DELETE'])
def history():
    if request.method == 'GET':
        repository_id = request.args['repository']
        username = request.args['username']
        return jsonify(
            get_queries(repository_id=repository_id, username=username))

    elif request.method == 'POST':
        username = request.args['username']
        repository = request.args['repository']
        query = request.args['query']
        title = request.args['title']
        if title:
            save_query(repository_id=repository,
                       sparql=query,
                       title=title,
                       username=username)
        return query
    elif request.method == 'DELETE':
        username = request.args['username']
        repository_id = request.args['repository']
        return delete_all_queries(repository_id=repository_id,
                                  username=username)


@app.route('/api-url', methods=['GET', 'POST'])
def graphdb_url():
    global API_URL
    if request.method == 'GET':
        return API_URL
    elif request.method == 'POST':
        API_URL = request.args['url']
        return API_URL


@app.route('/dataset/classes', methods=['GET'])
def classes():
    if request.method == 'GET':
        repository = request.args['repository']
        with open(f'{QUERY_PATH}/all_classes.sparql', 'r') as query:
            response = requests.get(
                f'{API_URL}/repositories/{repository}'
                f'?query={urllib.parse.quote(query.read(), safe="")}')

        return remove_blank_nodes(
            response.text.replace('\r', '').splitlines()[1:])


@app.route('/dataset/class-hierarchy', methods=['GET'])
def class_hierarchy():
    if request.method == 'GET':
        repository = request.args['repository']
        with open(f'{QUERY_PATH}/class_hierarchy.sparql', 'r') as query:
            response = requests.get(
                f'{API_URL}/repositories/{repository}'
                f'?query={urllib.parse.quote(query.read(), safe="")}')

        result = response.text

        header = ['Subject', 'Predicate', 'Object']
        data = parse_ntriples_graph(result)
        data = list(filter(
            lambda row: not is_blank_node(row[0]) and not is_blank_node(row[2]),
            data))
        return jsonify({'header': header, 'data': data})


@app.route('/dataset/triplet-count', methods=['GET'])
def triplets():
    if request.method == 'GET':
        repository = request.args['repository']
        with open(f'{QUERY_PATH}/count_triplets.sparql', 'r') as query:
            response = requests.get(
                f'{API_URL}/repositories/{repository}'
                f'?query={urllib.parse.quote(query.read(), safe="")}')

        result = response.text

        return result.split('\n')[1]


@app.route('/dataset/all-types', methods=['GET'])
def all_types():
    if request.method == 'GET':
        repository = request.args['repository']
        with open(f'{QUERY_PATH}/all_types.sparql', 'r') as query:
            response = requests.get(
                f'{API_URL}/repositories/{repository}'
                f'?query={urllib.parse.quote(query.read(), safe="")}')

        types = response.text.replace('\r', '').splitlines()[1:]
        return remove_blank_nodes(types)


@app.route('/dataset/type', methods=['GET'])
def get_type():
    if request.method == 'GET':
        repository = request.args['repository']
        uri = request.args['uri']
        with open(f'{QUERY_PATH}/get_type.sparql', 'r') as query:
            response = requests.get(
                f'{API_URL}/repositories/{repository}'
                f'?query={urllib.parse.quote(query.read().format(uri=uri), safe="")}')

        return response.text.replace('\r', '').splitlines()[1:]


@app.route('/dataset/type-properties', methods=['GET'])
def type_properties():
    if request.method == 'GET':
        repository = request.args['repository']
        rdf_type = request.args['type']
        with open(f'{QUERY_PATH}/type_properties.sparql', 'r') as query:
            response = requests.get(
                f'{API_URL}/repositories/{repository}'
                f'?query={urllib.parse.quote(query.read().format(type=rdf_type), safe="")}'
            )

        return response.text.replace('\r', '').splitlines()[1:]


@app.route('/dataset/meta-information', methods=['GET'])
def meta_information():
    if request.method == 'GET':
        repository = request.args['repository']
        uri = request.args['uri']
        with open(f'{QUERY_PATH}/meta_information.sparql', 'r') as query:
            # print(query.read().format(uri=uri))
            # query.seek(0)
            response = requests.get(
                f'{API_URL}/repositories/{repository}'
                f'?query={urllib.parse.quote(query.read().format(uri=uri), safe="")}'
            )
        info = response.text

        fields = info.split('\n')[0].split(',')
        values = info.split('\n')[1].split(',')

        return jsonify(dict(zip(fields, values)))


@app.route('/dataset/outgoing-links', methods=['GET'])
def outgoing_links():
    if request.method == 'GET':
        repository = request.args['repository']
        uri = request.args['uri']
        with open(f'{QUERY_PATH}/outgoing_links.sparql', 'r') as query:
            response = requests.get(
                f'{API_URL}/repositories/{repository}'
                f'?query={urllib.parse.quote(query.read().format(uri=uri), safe="")}'
            )
        result = parse_csv_text(response.text, skip_header=True)
        links = {}
        for [uri, count] in result:
            links[uri] = int(count)

        return jsonify(links)


@app.route('/dataset/incoming-links', methods=['GET'])
def incoming_links():
    if request.method == 'GET':
        repository = request.args['repository']
        uri = request.args['uri']
        with open(f'{QUERY_PATH}/incoming_links.sparql', 'r') as query:
            response = requests.get(
                f'{API_URL}/repositories/{repository}'
                f'?query={urllib.parse.quote(query.read().format(uri=uri), safe="")}'
            )
        result = parse_csv_text(response.text, skip_header=True)
        links = {}
        for [uri, count] in result:
            links[uri] = int(count)

        return jsonify(links)


@app.route('/dataset/all-properties', methods=['GET'])
def all_properties():
    if request.method == 'GET':
        repository = request.args['repository']
        with open(f'{QUERY_PATH}/all_properties.sparql', 'r') as query:
            response = requests.get(
                f'{API_URL}/repositories/{repository}'
                f'?query={urllib.parse.quote(query.read(), safe="")}'
            )
        # Remove carriage return character and skip header on first line
        return response.text.replace('\r', '').splitlines()[1:]


@app.route('/dataset/type-instances', methods=['GET'])
def type_instances():
    if request.method == 'GET':
        repository = request.args['repository']
        type_ = request.args['type']
        with open(f'{QUERY_PATH}/type_instances.sparql', 'r') as query:
            response = requests.get(
                f'{API_URL}/repositories/{repository}'
                f'?query={urllib.parse.quote(query.read().format(type=type_), safe="")}'
            )
        # Remove carriage return character and skip header on first line
        return response.text.replace('\r', '').splitlines()[1:]


@app.route('/dataset/property-values', methods=['GET'])
def property_values():
    if request.method == 'GET':
        repository = request.args['repository']
        uri = request.args['uri']
        prop_type = request.args['propType']
        with open(f'{QUERY_PATH}/property_values.sparql', 'r') as query:
            response = requests.get(
                f'{API_URL}/repositories/{repository}'
                f'?query={urllib.parse.quote(query.read().format(uri=uri, prop_type=prop_type), safe="")} '
            )
        return parse_csv_text(response.text, skip_header=True)


@app.route('/analysis', methods=['GET'])
def analysis():
    if request.method == 'GET':
        query = request.args['query']
        repository = request.args['repository']
        return jsonify(
            query_analysis(query=query, repository=repository, api=API_URL))
