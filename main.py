import logging
import os
from typing import List, Optional
from urllib.parse import unquote

from fastapi import FastAPI, Depends, HTTPException, Query, Form, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session

from database.database import engine, get_db, Base
from models.email import Email as EmailModel
from schemas.email import EmailResponse

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

ATTACHMENTS_DIR = "attachments"


@app.on_event("startup")
async def startup():
    # Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)


@app.post("/emails/", response_model=EmailResponse)
async def create_email(
        sender_email: str = Form(...),
        receiver_email: str = Form(...),
        subject: str = Form(...),
        body: str = Form(...),
        attachments: List[UploadFile] = File([]),
        db: Session = Depends(get_db)
):
    try:
        logger.info(f"Received email creation request: {receiver_email}, {subject}, "
                    f"{body}, attachments={len(attachments)}")

        attachment_paths = []

        for attachment in attachments:
            file_location = os.path.join(ATTACHMENTS_DIR, attachment.filename)
            with open(file_location, "wb+") as file_object:
                file_object.write(await attachment.read())
            attachment_paths.append(file_location)

        db_email = EmailModel(
            sender_email=sender_email,
            receiver_email=receiver_email,
            subject=subject,
            body=body,
            attachments=','.join(attachment_paths) if attachment_paths else None)
        db.add(db_email)
        db.commit()
        db.refresh(db_email)
        logger.info(f"Email created with ID: {db_email.id}")

        return {
            "id": db_email.id,
            "sender_email": db_email.sender_email,
            "receiver_email": db_email.receiver_email,
            "subject": db_email.subject,
            "body": db_email.body,
            "attachments": attachment_paths if attachment_paths else [],
            "date_sent": db_email.date_sent
        }
    except Exception as e:
        logger.error(f"Error creating email: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")


@app.get("/emails/", response_model=List[EmailResponse])
def get_emails(
        sender_email: Optional[str] = Query(None),
        receiver_email: Optional[str] = Query(None),
        db: Session = Depends(get_db)
):
    query = db.query(EmailModel)

    if sender_email:
        query = query.filter(EmailModel.sender_email == sender_email)

    if receiver_email:
        query = query.filter(EmailModel.receiver_email == receiver_email)

    emails = query.all()

    response_emails = []
    for email in emails:
        attachments = email.attachments if isinstance(email.attachments, list) else [email.attachments] if email.attachments else []
        response_emails.append(
            EmailResponse(
                id=email.id,
                subject=email.subject,
                sender_email=email.sender_email,
                body=email.body,
                receiver_email=email.receiver_email,
                attachments=attachments,
                date_sent=email.date_sent.isoformat()
            )
        )

    return response_emails


# @app.get("/emails/{receiver_email}", response_model=List[EmailResponse])
# async def get_emails_for_user(receiver_email: str, db: Session = Depends(get_db)):
#     emails = db.query(EmailModel).filter(EmailModel.receiver_email == receiver_email).all()
#
#     response_emails = []
#     for email in emails:
#         attachments = email.attachments if isinstance(email.attachments, list) else [email.attachments] if email.attachments else []
#         response_emails.append(
#             EmailResponse(
#                 id=email.id,
#                 subject=email.subject,
#                 sender_email=email.sender_email,
#                 body=email.body,
#                 receiver_email=email.receiver_email,
#                 attachments=attachments,
#                 date_sent=email.date_sent.isoformat()
#             )
#         )
#     logger.info(f'emails: {response_emails}')
#     return response_emails


@app.get("/download/attachments/{filename}")
async def download_file(filename: str):
    # file_path = os.path.join(ATTACHMENTS_DIR, filename)
    decoded_filename = unquote(filename)

    file_path = os.path.join(ATTACHMENTS_DIR, decoded_filename.replace("\\", "/"))
    logger.info(f'file_path: {file_path}')

    if not os.path.exists(file_path):
        raise HTTPException(status_code=404, detail="File not found")
    return FileResponse(file_path, media_type='application/octet-stream', filename=filename)