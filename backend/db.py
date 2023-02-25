import sqlite3
from datetime import datetime

# conn = sqlite3.connect('./database.db')
# conn.row_factory = sqlite3.Row
# conn.execute('CREATE TABLE IF NOT EXISTS query ('
#              'id INTEGER PRIMARY KEY,'
#              'sparql TEXT,'
#              'date TEXT'
#              ')')
#


def get_queries():
    conn = sqlite3.connect('./database.db')
    conn.row_factory = sqlite3.Row
    cur = conn.cursor()
    cur.execute('SELECT *'
                'FROM query')
    conn.commit()
    return [dict(row) for row in cur.fetchall()]


def add_query(sparql: str) -> None:
    conn = sqlite3.connect('./database.db')
    conn.execute('INSERT INTO query (sparql, date)'
                 'VALUES (?, ?)',
                 (sparql, datetime.now().strftime('%Y/%m/%d %H:%M:%S')))

    conn.commit()


def delete_all_queries() -> None:
    conn = sqlite3.connect('./database.db')
    conn.execute('DELETE FROM query')
    conn.commit()


# if __name__ == '__main__':
#     add_query('Hello World')
#     # delete_all_queries()
#     print(get_queries())
