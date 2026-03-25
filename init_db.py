import sqlite3
import time

def initialize_database():
    connection = sqlite3.connect('totally_not_my_privateKeys.db')
    cursor = connection.cursor()

    # 1. Create the table based on the Project 2 schema
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS keys(
            kid INTEGER PRIMARY KEY AUTOINCREMENT,
            key BLOB NOT NULL,
            exp INTEGER NOT NULL
        )
    ''')

   
    current_time = int(time.time())
    
    expired_key_pem = "---BEGIN RSA PRIVATE KEY---..." 
    valid_key_pem = "---BEGIN RSA PRIVATE KEY---..."

    cursor.execute("INSERT INTO keys (key, exp) VALUES (?, ?)", 
                   (expired_key_pem, current_time - 3600))
    
    cursor.execute("INSERT INTO keys (key, exp) VALUES (?, ?)", 
                   (valid_key_pem, current_time + 3600))

    connection.commit()
    connection.close()
    print("Database 'totally_not_my_privateKeys.db' generated successfully.")

if __name__ == "__main__":
    initialize_database()