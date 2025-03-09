from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session
from . import models, schema
from .database import SessionLocal, engine
from fastapi.middleware.cors import CORSMiddleware
import os

models.Base.metadata.create_all(bind=engine)

app = FastAPI()


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.get("/api/stocks", response_model=list[schema.StockData])
def read_stocks(trade_code: str = None, db: Session = Depends(get_db)):
    query = db.query(models.StockData)
    if trade_code:
        query = query.filter(models.StockData.trade_code == trade_code)
    return query.order_by(models.StockData.date.asc()).all()

@app.get("/api/trade-codes")
def get_trade_codes(db: Session = Depends(get_db)):
    codes = db.query(models.StockData.trade_code).distinct().all()
    return [code[0] for code in codes]

@app.put("/api/stocks/{stock_id}", response_model=schema.StockData)
def update_stock(
    stock_id: int,
    stock_data: schema.StockDataUpdate,
    db: Session = Depends(get_db)
):
    db_stock = db.query(models.StockData).filter(models.StockData.id == stock_id).first()
    if not db_stock:
        raise HTTPException(status_code=404, detail="Stock not found")
    
    for key, value in stock_data.dict().items():
        setattr(db_stock, key, value)
    
    db.commit()
    db.refresh(db_stock)
    return db_stock