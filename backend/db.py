import sqlite3
from datetime import datetime
import pickle

from backend.repository import RDFRepository

DB_PATH = 'backend/database.db'


def db_reset():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    conn.execute('CREATE TABLE IF NOT EXISTS user ('
                 'id INTEGER PRIMARY KEY,'
                 'username TEXT'
                 ')')
    conn.execute('CREATE TABLE IF NOT EXISTS repository ('
                 'id INTEGER PRIMARY KEY,'
                 'name TEXT,'
                 'obj BLOB,'
                 'user_id INTEGER NOT NULL'
                 'FOREIGN KEY (user_id)'
                 '  REFERENCES user (user_id)'
                 )
    conn.execute('DROP TABLE query')
    conn.execute('CREATE TABLE IF NOT EXISTS query ('
                 'id INTEGER PRIMARY KEY,'
                 'name TEXT,'
                 'sparql TEXT,'
                 'repository_id INTEGER NOT NULL,'
                 'date TEXT'
                 'FOREIGN KEY (repository_id)'
                 '  REFERENCES repository (repository_id)'
                 ')')


db_reset()


def get_queries(repository_name: str):
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    cur = conn.cursor()
    cur.execute('SELECT title, sparql, date, repository.name AS repository'
                'FROM query NATURAL JOIN repository'
                'WHERE repository.name = ?'
                'ORDER BY date DESC',
                [repository_name])

    return [dict(row) for row in cur.fetchall()]


def get_repository(*, repo_name: str, username: str) -> RDFRepository | None:
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    cur = conn.cursor()
    cur.execute('SELECT obj '
                'FROM repository NATURAL JOIN user'
                'WHERE repository.name = ? AND username = ?',
                [repo_name, username])

    row = cur.fetchone()
    if not row:
        return None
    blob = cur.fetchone()[0]
    return pickle.loads(blob)


def add_repository(*, repository: RDFRepository, username: str):
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    cur = conn.cursor()
    cur.execute('INSERT INTO repository (name, obj, user_id)'
                'VALUES (?, ?, (SELECT user_id FROM user WHERE username = ?))',
                [repository.name, pickle.dumps(repository), username])
    conn.commit()
    return True


def save_repository(*, repository: RDFRepository, username: str):
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    cur = conn.cursor()
    cur.execute('UPDATE repository'
                'SET obj = ?'
                'WHERE repository.name = ? '
                'AND username = (SELECT user_id FROM user WHERE username = ?)',
                [pickle.dumps(repository), repository.name, username])
    conn.commit()
    return True


def add_to_history(*, title: str, sparql: str, repository_id: str) -> None:
    conn = sqlite3.connect(DB_PATH)
    conn.execute('INSERT INTO query (title, sparql, repositoryId, date)'
                 'VALUES (?, ?, ?, ?)',
                 (title, sparql, repository_id,
                  datetime.now().strftime('%Y/%m/%d %H:%M:%S')))

    conn.commit()


def delete_all_queries(repository_id: str) -> None:
    conn = sqlite3.connect(DB_PATH)
    conn.execute('DELETE FROM query '
                 'WHERE repositoryId = ?', [repository_id])
    conn.commit()


if __name__ == '__main__':
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    conn.execute('DROP TABLE query')
    conn.execute('CREATE TABLE IF NOT EXISTS query ('
                 'id INTEGER PRIMARY KEY,'
                 'title TEXT,'
                 'sparql TEXT,'
                 'repositoryId TEXT,'
                 'date TEXT'
                 ')')
    print(get_queries('mondial'))
