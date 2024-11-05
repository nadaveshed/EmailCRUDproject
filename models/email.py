from datetime import datetime

from sqlalchemy import Column, Integer, String, DateTime

from database.database import Base


class Email(Base):
    __tablename__ = "emails"

    id = Column(Integer, primary_key=True, index=True)
    sender_email = Column(String, index=True)
    receiver_email = Column(String, index=True)
    subject = Column(String)
    body = Column(String)
    date_sent = Column(DateTime, default=datetime.utcnow)
    attachments = Column(String, nullable=True)
