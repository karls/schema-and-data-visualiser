import os
from flask import Flask, request, jsonify, flash
from werkzeug.utils import secure_filename
import requests
from flask_cors import CORS
from urllib import parse

from util import csv_to_json, csv_to_list, is_csv, convert_graph_to_list

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
        '/upload': 'POST: [file] - upload file with RDF data',
        '/query': 'POST: [repository, query] - runs query on given repository '
                  'id '
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
        response = requests.get(
            f'{GRAPHDB_API}/repositories/{repository}'
            f'?query={parse.quote(query, safe="")}')

        results = response.text
        if is_csv(results):
            header = results.split('\n')[0].split(',')
            data = csv_to_list(results)
        else:
            header = ['Subject', 'Predicate', 'Object']
            data = convert_graph_to_list(results)

        return jsonify({'header': header, 'data': data})
