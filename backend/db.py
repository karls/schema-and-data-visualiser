import sqlite3
from datetime import datetime
import compress_pickle
import os
from dotenv import load_dotenv, find_dotenv
import pymongo
from pymongo import MongoClient
from pymongo.server_api import ServerApi

from backend.repository import RDFRepository, LocalRepository, GraphDBRepository

load_dotenv(find_dotenv())

DB_PATH = 'backend/database.db'
COMPRESSION = 'gzip'
MONGODB_PASSWORD = os.environ['MONGODB_PASSWORD']

uri = f"mongodb+srv://user123:{MONGODB_PASSWORD}@cluster0.jpzpy.mongodb.net" \
      "/?retryWrites=true"
# Create a new client and connect to the server
client = MongoClient(uri, server_api=ServerApi('1'))
db = client['dataVisualiserDB']


def add_user(*, username: str):
    users = db['users']
    users.insert_one({'username': username})


def get_queries(*, repository_id: str, username: str):
    queries = db['queries']
    return list(queries.find({
        'repository': repository_id,
        'user': username
    }, {'_id': 0}).sort([('date', pymongo.DESCENDING)]))


def get_repository(*, repository_id: str,
                   username: str) -> RDFRepository | None:
    repositories = db['repositories']
    repo = repositories.find_one({'name': repository_id, 'user': username})
    if not repo:
        return None
    obj = repo['obj']
    return compress_pickle.loads(obj, COMPRESSION)


def get_repository_info(*, username: str):
    repositories = db['repositories']
    details = repositories.find({'user': username},
                                {'_id': 0, 'name': 1, 'description': 1})

    return list(details)


def add_repository(*, repository: RDFRepository, username: str,
                   description: str):
    repositories = db['repositories']
    return repositories.insert_one({
        'name': repository.name,
        'obj': compress_pickle.dumps(repository, COMPRESSION),
        'user': username,
        'description': description
    })


def save_repository(*, repository: RDFRepository, username: str):
    repositories = db['repositories']
    repositories.update_one({'name': repository.name, 'user': username}, {
        '$set': {'obj': compress_pickle.dumps(repository, COMPRESSION)}
    })


def save_query(*, title: str, sparql: str, repository_id: str,
               username: str):
    queries = db['queries']
    return queries.insert_one({
        'title': title,
        'sparql': sparql,
        'repository': repository_id,
        'user': username,
        'date': datetime.now()
    })


def delete_all_queries(*, repository_id: str, username: str) -> None:
    queries = db['queries']
    queries.delete_many({'repository': repository_id, 'username': username})


if __name__ == '__main__':
    # save_query(title='Get countries',
    #            sparql='SELECT ?country ...',
    #            repository_id='mondial',
    #            username='rohan')
    repo = LocalRepository(name="mondial",
                           data_url='https://www.dbis.informatik.uni-goettingen.de/Mondial/Mondial-RDF/mondial.n3',
                           schema_url='https://www.dbis.informatik.uni-goettingen.de/Mondial/Mondial-RDF/mondial-meta.n3')
    add_repository(repository=repo, username='rohan', description="Trial")
    # print(list(get_queries('mondial', 'rohan')))
    import time

    # t1 = time.time()
    # repository = LocalRepository(name="mondial",
    #                              data_url='https://www.dbis.informatik.uni-goettingen.de/Mondial/Mondial-RDF/mondial.n3',
    #                              schema_url='https://www.dbis.informatik.uni-goettingen.de/Mondial/Mondial-RDF/mondial-meta.n3')

    # repository = get_repository(repository_id='mondial', username='rohan')

    # repository = GraphDBRepository(name="mondial2",
    #                                server=os.environ['GRAPHDB_SERVER'])
    # add_repository(repository=repository, username='rohan', description="Trial")

    # t1 = time.time()
    # repository = get_repository(repository_id='mondial', username='rohan')
    qry = '''
    # PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
    # PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>
    # PREFIX : <http://www.semwebtech.org/mondial/10/meta#>
    # 
    # SELECT ?inflation ?unemployment
    # WHERE {
    #   ?c rdf:type :Country ;
    #     :name "India" ;
    #     :inflation ?inflation ;
    #     :unemployment ?unemployment .
    # }
PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>
PREFIX : <http://www.semwebtech.org/mondial/10/meta#>

SELECT DISTINCT ?continent ?country ?countryPop
WHERE {
 ?ct rdf:type :City ;
       :name ?city ;
       :cityIn ?c ;
       :population ?cityPop .
 ?c rdf:type :Country ;
   :name ?country ;
   :population ?countryPop ;
   :encompassedByInfo ?en .
 ?en :encompassedBy ?con ;
     :percent ?percent .
 ?con rdf:type :Continent ;
      :name ?continent .
  # FILTER (?percent > 50) .
} 
        '''
    # results = repository.run_query(query=qry)
    #
    # t2 = time.time()
    # print('Time taken: ', t2 - t1)
    # print(results)
