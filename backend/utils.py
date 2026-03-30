# utils.py — Utility / Helper Functions Module
# Demonstrates: Functions, String operations, List/Dict manipulation, Decorators

import time
import logging
import functools
from typing import Any, Callable

logger = logging.getLogger(__name__)


# ─── Decorator: Measure execution time ────────────────────────────────────────
def timer(func: Callable) -> Callable:
    """
    Decorator that logs how long a function takes to execute.
    Demonstrates: Decorators, *args, **kwargs, functools.wraps
    """
    @functools.wraps(func)
    def wrapper(*args, **kwargs) -> Any:
        start_time = time.time()
        result = func(*args, **kwargs)
        elapsed = time.time() - start_time
        logger.info(f"[TIMER] '{func.__name__}' completed in {elapsed:.2f}s")
        return result
    return wrapper


# ─── Decorator: Log function calls ────────────────────────────────────────────
def log_call(func: Callable) -> Callable:
    """
    Decorator that logs every function call with its arguments.
    Demonstrates: Decorators, introspection
    """
    @functools.wraps(func)
    def wrapper(*args, **kwargs) -> Any:
        logger.info(f"[CALL] Calling '{func.__name__}' with args={args[1:]} kwargs={list(kwargs.keys())}")
        return func(*args, **kwargs)
    return wrapper


# ─── Function: Sanitize resume text ───────────────────────────────────────────
def sanitize_text(text: str, max_chars: int = 8000) -> str:
    """
    Cleans and limits the extracted resume text.
    Demonstrates: String methods, slicing
    """
    if not text:
        return ""

    # Remove excessive whitespace
    lines: list[str] = text.splitlines()

    # List comprehension: filter out empty lines and strip each
    cleaned_lines = [line.strip() for line in lines if line.strip()]

    # Join cleaned lines
    cleaned_text = "\n".join(cleaned_lines)

    # Limit to max characters to avoid huge prompts
    if len(cleaned_text) > max_chars:
        logger.warning(f"Text truncated from {len(cleaned_text)} to {max_chars} chars.")
        cleaned_text = cleaned_text[:max_chars]

    return cleaned_text


# ─── Function: Format API error response ──────────────────────────────────────
def error_response(message: str, code: int = 400) -> tuple:
    """
    Returns a standardized error dict and HTTP status code as a tuple.
    Demonstrates: Tuple return, Dict creation
    """
    response: dict = {
        "error": message,
        "status": "failed",
        "code": code,
    }
    return (response, code)


# ─── Function: Format success response ────────────────────────────────────────
def success_response(data: dict) -> dict:
    """
    Wraps analysis data in a standard success response dict.
    Demonstrates: Dict merging, Dict operations
    """
    meta: dict = {
        "status": "success",
    }
    # Merge meta with data using dict unpacking
    return {**meta, **data}


# ─── Function: Extract keywords from text ─────────────────────────────────────
def extract_keywords(text: str, keyword_list: list[str]) -> list[str]:
    """
    Finds which keywords from a list appear in the resume text.
    Demonstrates: List comprehension, String methods
    """
    text_lower = text.lower()
    # List comprehension: filter keywords found in text
    found = [kw for kw in keyword_list if kw.lower() in text_lower]
    return found


# ─── Function: Score to grade ─────────────────────────────────────────────────
def score_to_grade(score: int) -> str:
    """
    Converts a numerical score to a letter grade.
    Demonstrates: if-elif-else, tuple unpacking implicitly
    """
    grade_map: list[tuple] = [
        (90, "A+"),
        (80, "A"),
        (70, "B+"),
        (60, "B"),
        (50, "C"),
        (0,  "D"),
    ]

    for threshold, grade in grade_map:
        if score >= threshold:
            return grade
    return "F"