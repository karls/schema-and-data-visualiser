import os
from flask import Flask, request, jsonify, redirect, url_for, flash
from werkzeug.utils import secure_filename
import requests
from flask_cors import CORS

from util import csv_to_json

app = Flask(__name__)
app.secret_key = 'imperial-college-london'
UPLOAD_FOLDER = 'imports'

GRAPHDB_API = 'http://localhost:7200'
CORS(app)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
ALLOWED_EXTENSIONS = {'rdf', 'xml', 'nt', 'n3', 'ttl', 'nt11', 'txt'}


@app.route('/', methods=['GET'])
def hello_world():
    api = {
        '/upload': 'upload file with RDF data'
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
