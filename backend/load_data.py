from app.database import SessionLocal
from app.csv_processor import process_csv

db = SessionLocal()
process_csv("stock_market_data.csv", db)
db.close()
print("Data imported successfully!")