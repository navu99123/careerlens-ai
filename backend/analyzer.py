# analyzer.py — Core AI Analysis Module
# Demonstrates: OOP (Class, __init__, methods, properties), Exception Handling,
#               Dicts, Lists, String formatting, Modules

import json
import logging
import os
from groq import Groq
from models import AnalysisResult, ROLE_SKILLS_MAP, SUPPORTED_ROLES

logger = logging.getLogger(__name__)


# ─── Custom Exception ─────────────────────────────────────────────────────────
class AnalysisError(Exception):
    """Raised when AI analysis fails"""
    pass


# ─── OOP: ResumeAnalyzer Class ────────────────────────────────────────────────
class ResumeAnalyzer:
    """
    Handles AI-powered resume analysis using Groq (LLaMA model).

    Demonstrates OOP concepts:
    - __init__ (constructor)
    - Instance variables
    - Methods
    - Properties (@property)
    - Class variable
    - Encapsulation
    """

    # Class variable — shared across all instances
    total_analyses_done: int = 0

    def __init__(self, api_key: str):
        """
        Constructor: Initializes the analyzer with Groq API.
        Demonstrates: __init__, instance variables, exception handling
        """
        if not api_key:
            raise ValueError("Groq API key cannot be empty.")

        # Instance variables
        self._api_key = api_key
        self._model_name = "llama-3.3-70b-versatile"
        self._last_role: str = ""
        self._last_score: int = 0

        # Configure Groq client
        try:
            self._client = Groq(api_key=self._api_key)
            logger.info(f"ResumeAnalyzer initialized with model: {self._model_name}")
        except Exception as e:
            raise AnalysisError(f"Failed to initialize Groq client: {e}")

    # ─── Property ────────────────────────────────────────────────────────────
    @property
    def last_role(self) -> str:
        """Read-only property for last analyzed role"""
        return self._last_role

    @property
    def last_score(self) -> int:
        """Read-only property for last analysis score"""
        return self._last_score

    # ─── Method: Validate role ────────────────────────────────────────────────
    def is_valid_role(self, role: str) -> bool:
        """
        Checks if the role is in the supported roles tuple.
        Demonstrates: 'in' operator on tuple
        """
        return role in SUPPORTED_ROLES

    # ─── Method: Build prompt ─────────────────────────────────────────────────
    def _build_prompt(self, resume_text: str, role: str) -> str:
        """
        Private method to build the AI prompt.
        Demonstrates: f-strings, dict lookup, list operations
        """
        # Dict lookup: get key skills for the role
        key_skills: list = ROLE_SKILLS_MAP.get(role, ["Problem Solving", "Communication", "Teamwork"])

        # Format skills list into a string
        skills_str = ", ".join(key_skills)

        prompt = f"""
You are an expert career advisor and resume analyst for freshers in India.
Analyze the following resume for a candidate applying for the role of: {role}

Key skills expected for {role}: {skills_str}

Resume Content:
{resume_text}

Respond ONLY with a valid JSON object. No markdown, no explanation, no extra text.
The JSON must follow this exact structure:
{{
  "overall_score": <integer from 0 to 100>,
  "summary": "<2-3 sentence overall summary of the candidate>",
  "strengths": ["<strength 1>", "<strength 2>", "<strength 3>", "<strength 4>"],
  "weaknesses": ["<weakness 1>", "<weakness 2>", "<weakness 3>"],
  "missing_skills": ["<skill 1>", "<skill 2>", "<skill 3>", "<skill 4>", "<skill 5>"],
  "career_paths": ["<career path 1>", "<career path 2>", "<career path 3>"],
  "interview_tips": ["<tip 1>", "<tip 2>", "<tip 3>", "<tip 4>"]
}}
"""
        return prompt.strip()

    # ─── Method: Parse AI response ────────────────────────────────────────────
    def _parse_response(self, raw_text: str) -> dict:
        """
        Private method to clean and parse the JSON response.
        Demonstrates: String methods, Exception Handling, Dict operations
        """
        cleaned = raw_text.strip()

        # Remove markdown code fences if present
        if cleaned.startswith("```"):
            lines = cleaned.split("\n")
            lines = [l for l in lines if not l.strip().startswith("```")]
            cleaned = "\n".join(lines).strip()

        try:
            parsed: dict = json.loads(cleaned)
            return parsed
        except json.JSONDecodeError as e:
            raise AnalysisError(f"AI returned invalid JSON: {e}\nRaw response: {raw_text[:200]}")

    # ─── Method: Validate parsed result ──────────────────────────────────────
    def _validate_result(self, data: dict) -> dict:
        """
        Ensures all required keys are present in the parsed dict.
        Demonstrates: Dict operations, List comprehension, Exception Handling
        """
        required_keys = [
            "overall_score", "summary", "strengths",
            "weaknesses", "missing_skills", "career_paths", "interview_tips"
        ]

        # List comprehension: find missing keys
        missing_keys = [key for key in required_keys if key not in data]

        if missing_keys:
            raise AnalysisError(f"AI response missing required fields: {missing_keys}")

        # Ensure score is within valid range
        data["overall_score"] = max(0, min(100, int(data["overall_score"])))

        # Ensure all list fields are actually lists
        list_fields = ["strengths", "weaknesses", "missing_skills", "career_paths", "interview_tips"]
        for field in list_fields:
            if not isinstance(data[field], list):
                data[field] = [str(data[field])]

        return data

    # ─── Main Method: Analyze resume ──────────────────────────────────────────
    def analyze(self, resume_text: str, role: str) -> AnalysisResult:
        """
        Main public method: Runs the full AI analysis pipeline.
        Demonstrates: Method calling, OOP flow, Exception Handling, Class variable
        """
        # Validate role
        if not self.is_valid_role(role):
            logger.warning(f"Invalid role '{role}'. Defaulting to 'Software Engineer'.")
            role = "Software Engineer"

        if not resume_text or len(resume_text.strip()) < 50:
            raise AnalysisError("Resume text is too short or empty to analyze.")

        logger.info(f"Starting analysis for role: {role}")

        # Step 1: Build prompt
        prompt = self._build_prompt(resume_text, role)

        # Step 2: Call Groq API
        try:
            chat_completion = self._client.chat.completions.create(
                messages=[
                    {
                        "role": "system",
                        "content": "You are an expert resume analyst. Always respond with valid JSON only."
                    },
                    {
                        "role": "user",
                        "content": prompt
                    }
                ],
                model=self._model_name,
                temperature=0.3,
                max_tokens=1500,
            )
            raw_text = chat_completion.choices[0].message.content
        except Exception as e:
            raise AnalysisError(f"Groq API call failed: {e}")

        # Step 3: Parse response
        parsed_data = self._parse_response(raw_text)

        # Step 4: Validate parsed data
        validated_data = self._validate_result(parsed_data)

        # Step 5: Build AnalysisResult dataclass
        result = AnalysisResult(
            overall_score=validated_data["overall_score"],
            summary=validated_data["summary"],
            strengths=validated_data["strengths"],
            weaknesses=validated_data["weaknesses"],
            missing_skills=validated_data["missing_skills"],
            career_paths=validated_data["career_paths"],
            interview_tips=validated_data["interview_tips"],
        )

        # Update instance and class variables
        self._last_role = role
        self._last_score = result.overall_score
        ResumeAnalyzer.total_analyses_done += 1

        label, _ = result.get_score_label()   # Tuple unpacking
        logger.info(
            f"Analysis complete. Score: {result.overall_score}/100 | "
            f"Label: {label} | Total analyses done: {ResumeAnalyzer.total_analyses_done}"
        )

        return result