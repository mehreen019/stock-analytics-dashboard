import pandas as pd
from sqlalchemy.orm import Session
from .models import StockData

def process_csv(file_path: str, db: Session):
    df = pd.read_csv(file_path, parse_dates=['date'])

    numeric_columns = ['high', 'low', 'open', 'close', 'volume']
    for col in numeric_columns:
        df[col] = df[col].astype(str).str.replace(',', '').astype(float)


    numeric_cols = ['high', 'low', 'open', 'close', 'volume']
    df[numeric_cols] = df[numeric_cols].fillna(0)

    df.replace({'high': 0, 'low': 0, 'open': 0, 'close': 0}, None, inplace=True)
    
    
    for _, row in df.iterrows():
        db_record = StockData(
            date=row['date'],
            trade_code=row['trade_code'],
            high=row['high'],
            low=row['low'],
            open=row['open'],
            close=row['close'],
            volume=int(row['volume'])
        )
        db.add(db_record)

    db.commit()
