# models.py — Data Models using Python Dataclasses, Tuples, and Dicts

from dataclasses import dataclass, field
from typing import List, Tuple, Dict
from datetime import datetime


# ─── Dataclass: Represents a structured Resume Analysis Result ───────────────
@dataclass
class AnalysisResult:
    overall_score: int
    summary: str
    strengths: List[str] = field(default_factory=list)
    weaknesses: List[str] = field(default_factory=list)
    missing_skills: List[str] = field(default_factory=list)
    career_paths: List[str] = field(default_factory=list)
    interview_tips: List[str] = field(default_factory=list)
    analyzed_at: str = field(default_factory=lambda: datetime.now().strftime("%Y-%m-%d %H:%M:%S"))

    def to_dict(self) -> Dict:
        """Convert dataclass to dictionary for JSON response"""
        return {
            "overall_score": self.overall_score,
            "summary": self.summary,
            "strengths": self.strengths,
            "weaknesses": self.weaknesses,
            "missing_skills": self.missing_skills,
            "career_paths": self.career_paths,
            "interview_tips": self.interview_tips,
            "analyzed_at": self.analyzed_at,
        }

    def get_score_label(self) -> Tuple[str, str]:
        """
        Returns a tuple of (label, color_hint) based on score.
        Demonstrates: Tuples as return values
        """
        if self.overall_score >= 75:
            return ("Strong Profile", "green")
        elif self.overall_score >= 50:
            return ("Good Profile", "yellow")
        else:
            return ("Needs Improvement", "red")


# ─── Tuple: Supported job roles (immutable, fixed list) ─────────────────────
SUPPORTED_ROLES: Tuple[str, ...] = (
    "Software Engineer",
    "Full Stack Developer",
    "Frontend Developer",
    "Backend Developer",
    "Data Scientist",
    "Data Analyst",
    "Machine Learning Engineer",
    "DevOps Engineer",
    "UI/UX Designer",
    "Product Manager",
    "Cybersecurity Analyst",
    "Cloud Engineer",
)

# ─── Dict: Role-to-key-skills mapping ────────────────────────────────────────
ROLE_SKILLS_MAP: Dict[str, List[str]] = {
    "Software Engineer":       ["DSA", "System Design", "Git", "OOP", "Testing"],
    "Full Stack Developer":    ["React", "Node.js", "REST APIs", "SQL", "Docker"],
    "Frontend Developer":      ["React", "CSS", "TypeScript", "Figma", "Web Performance"],
    "Backend Developer":       ["Python/Java", "REST APIs", "Databases", "Docker", "Security"],
    "Data Scientist":          ["Python", "ML", "Statistics", "Pandas", "Visualization"],
    "Data Analyst":            ["SQL", "Excel", "Power BI", "Statistics", "Python"],
    "Machine Learning Engineer":["PyTorch", "TensorFlow", "MLOps", "Python", "Math"],
    "DevOps Engineer":         ["Docker", "Kubernetes", "CI/CD", "Linux", "Cloud"],
    "UI/UX Designer":          ["Figma", "User Research", "Prototyping", "CSS", "Design Systems"],
    "Product Manager":         ["Roadmapping", "Agile", "Analytics", "Communication", "SQL"],
    "Cybersecurity Analyst":   ["Networking", "Ethical Hacking", "SIEM", "Python", "Risk Analysis"],
    "Cloud Engineer":          ["AWS/GCP/Azure", "Terraform", "Docker", "Linux", "Networking"],
}