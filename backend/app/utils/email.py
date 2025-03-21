from loguru import logger

def send_email(to: str, subject: str, body: str):
    # Simulate sending email by logging the email details
    logger.info(f"Sending email to {to} with subject '{subject}': {body}")
