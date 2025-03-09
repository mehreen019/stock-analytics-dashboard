from app.database import engine, Base
from app.models import StockData 


Base.metadata.create_all(bind=engine)

print("Tables created successfully!")
