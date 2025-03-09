from pydantic import BaseModel, Field
from datetime import date
from typing import Optional

class StockDataBase(BaseModel):
    date: date
    trade_code: str
    high: Optional[float] = Field(None, ge=0)
    low: Optional[float] = Field(None, ge=0)
    open: Optional[float] = Field(None, ge=0)
    close: Optional[float] = Field(None, ge=0)
    volume: Optional[float] = Field(None, ge=0)

class StockDataCreate(StockDataBase):
    pass

class StockDataUpdate(StockDataBase):
    pass

class StockData(StockDataBase):
    id: int

    class Config:
        orm_mode = True