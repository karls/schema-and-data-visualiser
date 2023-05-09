import json
import os
from flask import Flask, request, jsonify, flash
from werkzeug.utils import secure_filename
import requests
from flask_cors import CORS
from urllib import parse
from db import add_query, get_queries, delete_all_queries
from util import csv_to_json, parse_csv_text, is_csv, parse_ntriples_graph, \
    is_ntriples_format

app = Flask(__name__)
app.secret_key = 'imperial-college-london'
UPLOAD_FOLDER = 'imports'

GRAPHDB_API = 'http://localhost:7200'
CORS(app)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
ALLOWED_EXTENSIONS = {'rdf', 'xml', 'nt', 'n3', 'ttl', 'nt11', 'txt'}


@app.route('/', methods=['GET'])
def get_api():
    api = {
        '/repositories': 'GET - returns list of all repository ids',
        '/upload': 'POST [file] - upload file with RDF data',
        '/query': 'POST [repository, query] - runs query on given repository '
                  'id ',
        '/query/history': 'GET - Get all queries run on current repository'
    }
    return jsonify(api)


def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS


@app.route('/repositories', methods=['GET'])
def get_repositories():
    response = requests.get(f'{GRAPHDB_API}/repositories')
    return csv_to_json(response.text)


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


@app.route('/query', methods=['POST'])
def run_query():
    if request.method == 'POST':
        repository = request.json['repository']
        query = request.json['query']

        add_query(repository_id=repository,
                  sparql=query['sparql'],
                  title=query['title'])

        response = requests.get(
            f'{GRAPHDB_API}/repositories/{repository}'
            f'?query={parse.quote(query["sparql"], safe="")}')

        results = response.text
        if is_ntriples_format(results):
            header = ['Subject', 'Predicate', 'Object']
            data = parse_ntriples_graph(results)
        else:
            header = results.split('\n')[0].split(',')
            data = parse_csv_text(results)

        return jsonify({'header': header, 'data': data})


@app.route('/history', methods=['GET', 'DELETE'])
def history():
    if request.method == 'GET':
        repository_id = request.args['repositoryId']
        return jsonify(get_queries(repository_id))
    elif request.method == 'DELETE':
        repository_id = request.args['repositoryId']
        return delete_all_queries(repository_id)


@app.route('/graphdb/url', methods=['GET', 'POST'])
def graphdb_url():
    global GRAPHDB_API
    if request.method == 'GET':
        return GRAPHDB_API
    elif request.method == 'POST':
        GRAPHDB_API = request.args['graphdbURL']
        return GRAPHDB_API


@app.route('/dataset/classes', methods=['GET'])
def classes():
    if request.method == 'GET':
        repository = request.args['repository']
        with open('queries/all_classes.sparql', 'r') as query:
            response = requests.get(
                f'{GRAPHDB_API}/repositories/{repository}'
                f'?query={parse.quote(query.read(), safe="")}')

        return parse_csv_text(response.text, header=True)


@app.route('/dataset/class-hierarchy', methods=['GET'])
def class_hierarchy():
    if request.method == 'GET':
        repository = request.args['repository']
        with open('./queries/class_hierarchy.sparql', 'r') as query:
            response = requests.get(
                f'{GRAPHDB_API}/repositories/{repository}'
                f'?query={parse.quote(query.read(), safe="")}')

        result = response.text

        header = ['Subject', 'Predicate', 'Object']
        data = parse_ntriples_graph(result)

        return jsonify({'header': header, 'data': data})


@app.route('/dataset/triplet-count', methods=['GET'])
def triplets():
    if request.method == 'GET':
        repository = request.args['repository']
        with open('./queries/count_triplets.sparql', 'r') as query:
            response = requests.get(
                f'{GRAPHDB_API}/repositories/{repository}'
                f'?query={parse.quote(query.read(), safe="")}')

        result = response.text
        print(result)
        return result.split('\n')[1]


@app.route('/dataset/types', methods=['GET'])
def all_types():
    if request.method == 'GET':
        repository = request.args['repository']
        with open('queries/all_types.sparql', 'r') as query:
            response = requests.get(
                f'{GRAPHDB_API}/repositories/{repository}'
                f'?query={parse.quote(query.read(), safe="")}')

        return parse_csv_text(response.text, header=True)