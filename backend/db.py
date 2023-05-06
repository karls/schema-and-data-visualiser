import sqlite3
from datetime import datetime

def get_queries(repository_id: str):
    conn = sqlite3.connect('./database.db')
    conn.row_factory = sqlite3.Row
    cur = conn.cursor()
    cur.execute('SELECT * FROM query WHERE repositoryId = ? ORDER BY date DESC',
                [repository_id])
    conn.commit()
    return [dict(row) for row in cur.fetchall()]


def add_query(*, title: str, sparql: str, repository_id: str) -> None:
    conn = sqlite3.connect('./database.db')
    conn.execute('INSERT INTO query (title, sparql, repositoryId, date)'
                 'VALUES (?, ?, ?, ?)',
                 (title, sparql, repository_id,
                  datetime.now().strftime('%Y/%m/%d %H:%M:%S')))

    conn.commit()


def delete_all_queries(repository_id: str) -> None:
    conn = sqlite3.connect('./database.db')
    conn.execute('DELETE FROM query WHERE repositoryId = ?', [repository_id])
    conn.commit()


if __name__=='__main__':
    conn = sqlite3.connect('./database.db')
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

