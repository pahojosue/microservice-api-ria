from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

# 1️⃣ Connection string: tells Python how to reach MySQL
DATABASE_URL = "mysql+pymysql://root:@localhost:3306/user_service_db"

# 2️⃣ Engine = actual connection to the database
engine = create_engine(
    DATABASE_URL,
    echo=True  # shows SQL commands in terminal (for learning/debugging)
)

# 3️⃣ Session = how we talk to the DB (read/write data)
SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine
)

# 4️⃣ Base = parent class for all database models (tables)
Base = declarative_base()