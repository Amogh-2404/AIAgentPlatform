from loguru import logger

def setup_logging():
    logger.add("logs/app.log", rotation="10 MB")
    logger.info("Logging is configured.")
