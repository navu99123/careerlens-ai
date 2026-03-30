import os
import logging
from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
 
# ─── Import our custom modules ────────────────────────────────────────────────
from analyzer import ResumeAnalyzer, AnalysisError
from pdf_reader import (
    extract_text_from_pdf,
    save_analysis_log,
    read_analysis_history,
    validate_file,
    PDFReadError,
    FileSizeError,
)
from utils import sanitize_text, error_response, success_response, timer, score_to_grade
 
# ─── Load environment variables ───────────────────────────────────────────────
load_dotenv()
 
# ─── Logging setup ────────────────────────────────────────────────────────────
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s"
)
logger = logging.getLogger(__name__)
 
# ─── Flask app setup ──────────────────────────────────────────────────────────
app = Flask(__name__)
CORS(app)
 
# ─── Initialize ResumeAnalyzer (OOP: creating an object) ─────────────────────
try:
    analyzer = ResumeAnalyzer(api_key=os.getenv("GROQ_API_KEY", ""))
    logger.info("ResumeAnalyzer object created successfully.")
except Exception as e:
    logger.error(f"Failed to create ResumeAnalyzer: {e}")
    analyzer = None
 
 
# ─── Route: Health Check ──────────────────────────────────────────────────────
@app.route("/api/health", methods=["GET"])
def health():
    """
    Simple health check endpoint.
    Returns server status as a dict.
    """
    status: dict = {
        "status": "CareerLens AI backend is running!",
        "model": "gemini-1.5-flash",
        "total_analyses": ResumeAnalyzer.total_analyses_done,  # Class variable
        "analyzer_ready": analyzer is not None,
    }
    return jsonify(status), 200
 
 
# ─── Route: Analyze Resume ────────────────────────────────────────────────────
@app.route("/api/analyze", methods=["POST"])
@timer   # Decorator: measures how long this route takes
def analyze_resume():
    """
    Main endpoint: receives resume PDF + role, returns AI analysis.
    Demonstrates: Exception Handling, File Handling, OOP method call,
                  Dict operations, Tuple unpacking
    """
 
    # ── Step 1: Check analyzer is ready ──────────────────────────────────────
    if analyzer is None:
        response, code = error_response("AI analyzer is not available. Check your GEMINI_API_KEY.", 500)
        return jsonify(response), code
 
    # ── Step 2: Validate request has a file ──────────────────────────────────
    if "resume" not in request.files:
        response, code = error_response("No resume file found in request. Please upload a PDF.", 400)
        return jsonify(response), code
 
    file = request.files["resume"]
    role = request.form.get("role", "Software Engineer").strip()
 
    if file.filename == "":
        response, code = error_response("No file selected.", 400)
        return jsonify(response), code
 
    # ── Step 3: Validate file (tuple unpacking from validate_file) ────────────
    is_valid, validation_message = validate_file(file.filename, file.content_length or 0)
    if not is_valid:
        response, code = error_response(validation_message, 400)
        return jsonify(response), code
 
    # ── Step 4: Extract text from PDF (File Handling) ─────────────────────────
    try:
        raw_text = extract_text_from_pdf(file)
    except PDFReadError as e:
        response, code = error_response(str(e), 400)
        return jsonify(response), code
 
    # ── Step 5: Sanitize text (utility function) ──────────────────────────────
    clean_text = sanitize_text(raw_text, max_chars=8000)
 
    if len(clean_text) < 50:
        response, code = error_response("Resume has too little text. Please upload a proper resume.", 400)
        return jsonify(response), code
 
    # ── Step 6: Run AI Analysis (OOP method call) ─────────────────────────────
    try:
        result = analyzer.analyze(clean_text, role)    # Returns AnalysisResult object
    except AnalysisError as e:
        response, code = error_response(str(e), 500)
        return jsonify(response), code
    except Exception as e:
        logger.error(f"Unexpected error during analysis: {e}")
        response, code = error_response("An unexpected error occurred. Please try again.", 500)
        return jsonify(response), code
 
    # ── Step 7: Save log to file (File Writing) ───────────────────────────────
    try:
        save_analysis_log(
            filename=file.filename,
            role=role,
            score=result.overall_score,
        )
    except Exception as e:
        logger.warning(f"Could not save log: {e}")  # Non-critical, don't crash
 
    # ── Step 8: Add grade to result ───────────────────────────────────────────
    grade = score_to_grade(result.overall_score)
 
    # ── Step 9: Build and return response ─────────────────────────────────────
    result_dict = result.to_dict()            # Convert dataclass to dict
    result_dict["grade"] = grade             # Add grade to dict
 
    return jsonify(success_response(result_dict)), 200
 
 
# ─── Route: Analysis History ──────────────────────────────────────────────────
@app.route("/api/history", methods=["GET"])
def get_history():
    """
    Returns the analysis history from the log file.
    Demonstrates: File Reading, List of Dicts
    """
    try:
        history: list = read_analysis_history()
        return jsonify({
            "status": "success",
            "total": len(history),
            "history": history,
        }), 200
    except Exception as e:
        response, code = error_response(f"Could not read history: {e}", 500)
        return jsonify(response), code
 
 
# ─── Route: Get supported roles ───────────────────────────────────────────────
@app.route("/api/roles", methods=["GET"])
def get_roles():
    """
    Returns all supported job roles as a list.
    Demonstrates: Tuple to list conversion
    """
    from models import SUPPORTED_ROLES
    return jsonify({
        "status": "success",
        "roles": list(SUPPORTED_ROLES),   # Convert tuple to list for JSON
    }), 200
 
 
# ─── Run Flask server ─────────────────────────────────────────────────────────
if __name__ == "__main__":
    logger.info("Starting CareerLens AI backend server...")
    app.run(debug=True, port=5000)