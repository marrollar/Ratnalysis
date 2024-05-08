import sqlite3


class RatnalysisDatabase:
    _instance = None

    def __new__(cls, *args, **kwargs):
        if cls._instance is None:
            cls._instance = super().__new__(cls)
            cls._instance.connection = sqlite3.connect(*args, **kwargs)
        return cls._instance

    def __init__(self, *args, **kwargs):
        self.connection.execute("PRAGMA foreign_keys=1")
        self.cursor = self.connection.cursor()

    @staticmethod
    def get_instance(*args, **kwargs):
        if RatnalysisDatabase._instance is None:
            RatnalysisDatabase._instance = RatnalysisDatabase(*args, **kwargs)
        return RatnalysisDatabase._instance

    def close_connection(self):
        self.connection.close()
        RatnalysisDatabase._instance = None

    def drop_tables(self):
        self.connection.execute("DROP TABLE IF EXISTS sightings")
        self.connection.execute("DROP TABLE IF EXISTS stations")

    def create_tables(self):
        self.cursor.execute('''
        CREATE TABLE IF NOT EXISTS stations(
        station_id INTEGER PRIMARY KEY, 
        station_name TEXT,
        lines_served TEXT,
        lat TEXT DEFAULT NULL,
        long TEXT DEFAULT NULL
        )
        ''')

        self.cursor.execute('''
        CREATE TABLE IF NOT EXISTS sightings(
        station_id INTEGER, 
        so_many INTEGER, 
        one_or_two INTEGER, 
        none INTEGER, 
        date_start TEXT, 
        date_end TEXT,
        PRIMARY KEY (station_id, date_start, date_end),
        FOREIGN KEY (station_id) REFERENCES stations(station_id)
        )
        ''')
        self.connection.commit()

    def insert_stations(self, rows):
        self.cursor.executemany("INSERT OR IGNORE INTO stations VALUES(?, ?, ?, ?, ?)", rows)
        self.connection.commit()

    def insert_sightings(self, rows):
        self.cursor.executemany("INSERT OR IGNORE INTO sightings VALUES(?, ?, ?, ?, ?, ?)", rows)
        self.connection.commit()

    def update_latlong(self, rows):
        self.cursor.executemany("UPDATE stations SET lat=(?), long=(?) WHERE station_id=(?)", rows)
        self.connection.commit()

    def get_table_name(self, s_id):
        res = self.cursor.execute(f"SELECT station_name FROM stations WHERE station_id={s_id}")
        return res.fetchall()

    def get_cursor(self):
        return self.cursor
