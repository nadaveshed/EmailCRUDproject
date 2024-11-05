from datetime import datetime
from typing import Optional, List
from pydantic import BaseModel


class EmailCreate(BaseModel):
    sender_email: str
    receiver_email: str
    subject: str
    body: str
    attachments: Optional[List[str]] = None

    class Config:
        orm_mode = True


class EmailResponse(BaseModel):
    id: int
    subject: str
    sender_email: str
    receiver_email: str
    body: str
    date_sent: datetime
    attachments: Optional[List[str]] = None

    class Config:
        orm_mode = True
