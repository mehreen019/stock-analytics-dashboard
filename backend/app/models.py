from sqlalchemy import Column, Integer, String, Date, Numeric
from .database import Base

class StockData(Base):
    __tablename__ = "stock_table"

    id = Column(Integer, primary_key=True, index=True)
    date = Column(Date)
    trade_code = Column(String)
    high = Column(Numeric(10, 2), nullable=True)
    low = Column(Numeric(10, 2), nullable=True)
    open = Column(Numeric(10, 2), nullable=True)
    close = Column(Numeric(10, 2), nullable=True)
    volume = Column(Integer, nullable=True)