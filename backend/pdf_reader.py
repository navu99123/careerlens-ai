# pdf_reader.py — File Handling Module
# Demonstrates: File I/O, Exception Handling, Functions, OS module

import os
import io
import logging
import PyPDF2
from typing import Optional, Tuple

# ─── Logger setup ────────────────────────────────────────────────────────────
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# ─── Constants (Tuple: allowed file types) ───────────────────────────────────
ALLOWED_EXTENSIONS: Tuple[str, ...] = (".pdf",)
MAX_FILE_SIZE_MB: int = 5
MAX_FILE_SIZE_BYTES: int = MAX_FILE_SIZE_MB * 1024 * 1024


# ─── Custom Exception Class ───────────────────────────────────────────────────
class PDFReadError(Exception):
    """Custom exception raised when PDF reading fails"""
    def __init__(self, message: str, filename: str = ""):
        self.filename = filename
        super().__init__(f"[PDF Error] {message} | File: '{filename}'")


class FileSizeError(Exception):
    """Custom exception raised when file is too large"""
    pass


# ─── Function: Validate file before reading ───────────────────────────────────
def validate_file(filename: str, file_size: int) -> Tuple[bool, str]:
    """
    Validates the uploaded file.
    Returns a tuple of (is_valid: bool, message: str)
    Demonstrates: Tuples as return values, String methods
    """
    # Check extension
    _, ext = os.path.splitext(filename.lower())
    if ext not in ALLOWED_EXTENSIONS:
        return (False, f"Invalid file type '{ext}'. Only PDF files are allowed.")

    # Check file size
    if file_size > MAX_FILE_SIZE_BYTES:
        return (False, f"File too large ({file_size / 1024 / 1024:.1f} MB). Max allowed: {MAX_FILE_SIZE_MB} MB.")

    return (True, "File is valid.")


# ─── Function: Extract text from PDF (File Handling) ─────────────────────────
def extract_text_from_pdf(file_obj) -> str:
    """
    Reads and extracts text from a PDF file object.
    Demonstrates: File Handling, Exception Handling, List operations
    """
    extracted_pages: list[str] = []   # List to collect text from each page

    try:
        # Read file bytes into memory (in-memory file handling)
        file_bytes = file_obj.read()

        if len(file_bytes) == 0:
            raise PDFReadError("File is empty.", getattr(file_obj, 'filename', ''))

        # Use BytesIO to treat bytes as a file object
        pdf_stream = io.BytesIO(file_bytes)
        reader = PyPDF2.PdfReader(pdf_stream)

        total_pages = len(reader.pages)
        logger.info(f"PDF loaded successfully. Total pages: {total_pages}")

        # Iterate over pages and extract text
        for page_num in range(total_pages):
            try:
                page = reader.pages[page_num]
                page_text = page.extract_text()
                if page_text:
                    extracted_pages.append(page_text.strip())
                    logger.info(f"Page {page_num + 1}: Extracted {len(page_text)} characters.")
            except Exception as page_error:
                # Log but don't crash — skip unreadable pages
                logger.warning(f"Could not read page {page_num + 1}: {page_error}")
                continue

    except PDFReadError:
        raise
    except PyPDF2.errors.PdfReadError as e:
        raise PDFReadError(f"Corrupted or password-protected PDF: {e}")
    except Exception as e:
        raise PDFReadError(f"Unexpected error while reading PDF: {e}")

    if not extracted_pages:
        raise PDFReadError("No readable text found. The PDF may contain only images.")

    # Join all pages with newline separator
    full_text = "\n\n".join(extracted_pages)
    logger.info(f"Total extracted text length: {len(full_text)} characters.")
    return full_text


# ─── Function: Save analysis log to file (File Writing) ──────────────────────
def save_analysis_log(filename: str, role: str, score: int, log_dir: str = "logs") -> str:
    """
    Saves a log entry for each analysis to a .txt file.
    Demonstrates: File Writing (open/write/append), OS path operations
    """
    # Create logs directory if it doesn't exist
    os.makedirs(log_dir, exist_ok=True)

    log_file_path = os.path.join(log_dir, "analysis_history.txt")

    from datetime import datetime
    timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")

    log_entry = (
        f"[{timestamp}] File: {filename} | Role: {role} | Score: {score}/100\n"
    )

    try:
        # Append to log file (file handling: write mode 'a')
        with open(log_file_path, "a", encoding="utf-8") as log_file:
            log_file.write(log_entry)
        logger.info(f"Log saved: {log_entry.strip()}")
    except IOError as e:
        logger.warning(f"Could not write log file: {e}")

    return log_file_path


# ─── Function: Read analysis history ─────────────────────────────────────────
def read_analysis_history(log_dir: str = "logs") -> list[dict]:
    """
    Reads the analysis log file and returns a list of dicts.
    Demonstrates: File Reading, String parsing, List of Dicts
    """
    log_file_path = os.path.join(log_dir, "analysis_history.txt")
    history: list[dict] = []

    try:
        with open(log_file_path, "r", encoding="utf-8") as log_file:
            lines = log_file.readlines()

        for line in lines:
            line = line.strip()
            if not line:
                continue
            # Parse each log line into a dict
            history.append({"entry": line})

    except FileNotFoundError:
        logger.info("No history file found yet.")
    except IOError as e:
        logger.warning(f"Could not read log file: {e}")

    return history