from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any

class StudentProgressRequest(BaseModel):
    student_id: str
    courses_enrolled: int
    courses_completed: int
    total_quizzes_taken: int
    quiz_scores: List[float] = Field(default_factory=list)
    tasks_completed: int
    total_tasks_assigned: int
    study_hours_weekly: float = 0.0

class StudentProgressResponse(BaseModel):
    student_id: str
    overall_progress_pct: float
    learning_velocity_score: float
    quiz_average: float
    task_completion_rate: float
    engagement_level: str
    strengths: List[str]
    recommendations: List[str]

class ProjectProgressRequest(BaseModel):
    project_id: str
    project_title: str
    total_milestones: int
    completed_milestones: int
    tasks_pending: int
    tasks_in_progress: int
    tasks_completed: int
    submission_count: int

class ProjectProgressResponse(BaseModel):
    project_id: str
    completion_percentage: float
    health_status: str
    blocker_risk: str
    predicted_completion_days: int
    insights: List[str]

class PerformanceBenchmarkingRequest(BaseModel):
    institution_id: str
    batch_name: str
    student_data: List[Dict[str, Any]]  # [{student_id, score, attendance_pct, tasks_done}]

class PerformanceBenchmarkingResponse(BaseModel):
    institution_id: str
    batch_name: str
    total_students: int
    average_performance_score: float
    top_performers_count: int
    at_risk_students_count: int
    class_attendance_average: float
    performance_distribution: Dict[str, int]

class SubmissionAnalysisRequest(BaseModel):
    submission_id: str
    title: str
    description: str
    github_url: Optional[str] = None
    file_url: Optional[str] = None
    submission_type: str = "DOCUMENT" # "CODE" or "DOCUMENT"

class SubmissionAnalysisResponse(BaseModel):
    submission_id: str
    completeness_score: float
    ai_recommendation: str
    code_quality_grade: Optional[str] = None
    syntax_issues_found: List[str] = Field(default_factory=list)
    formatting_issues: List[str] = Field(default_factory=list)
    mentor_action_suggested: str

class ReportRequest(BaseModel):
    student_id: str
    student_name: str
    period: str  # "WEEKLY" or "MONTHLY"
    learning_progress_pct: float
    project_status: str
    tasks_done: int
    total_tasks: int
    mentor_notes: Optional[str] = None

class ReportResponse(BaseModel):
    report_id: str
    generated_at: str
    student_id: str
    period: str
    summary_html: str
    key_highlights: List[str]
    areas_for_improvement: List[str]

class VariableScopeItem(BaseModel):
    name: str
    value: Any

class ExplanationItem(BaseModel):
    code: str
    steps: List[str]

class CodeExplanationRequest(BaseModel):
    code: str
    language: str = "python"
    inputs: List[Any] = Field(default_factory=list)

class CodeExplanationResponse(BaseModel):
    main_block_variables: List[VariableScopeItem]
    explanations: List[ExplanationItem]
