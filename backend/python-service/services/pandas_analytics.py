import pandas as pd
import numpy as np
from datetime import datetime
from models.schemas import (
    StudentProgressRequest, StudentProgressResponse,
    ProjectProgressRequest, ProjectProgressResponse,
    PerformanceBenchmarkingRequest, PerformanceBenchmarkingResponse,
    ReportRequest, ReportResponse
)

def analyze_student_progress(req: StudentProgressRequest) -> StudentProgressResponse:
    # Use pandas to process metrics
    quiz_avg = float(np.mean(req.quiz_scores)) if req.quiz_scores else 0.0
    task_rate = (req.tasks_completed / req.total_tasks_assigned * 100.0) if req.total_tasks_assigned > 0 else 0.0
    course_pct = (req.courses_completed / req.courses_enrolled * 100.0) if req.courses_enrolled > 0 else 0.0
    
    overall = (quiz_avg * 0.35) + (task_rate * 0.40) + (course_pct * 0.25)
    
    if req.study_hours_weekly >= 15:
        engagement = "HIGH"
    elif req.study_hours_weekly >= 7:
        engagement = "MODERATE"
    else:
        engagement = "NEEDS_IMPROVEMENT"
        
    strengths = []
    if quiz_avg >= 80:
        strengths.append("High Conceptual Mastery (Quizzes)")
    if task_rate >= 85:
        strengths.append("Excellent Task Execution & Timeliness")
    if req.study_hours_weekly >= 12:
        strengths.append("Strong Weekly Learning Consistency")
    if not strengths:
        strengths.append("Consistent Platform Participation")

    recommendations = []
    if quiz_avg < 65:
        recommendations.append("Review lesson video archives and attempt practice quiz modules.")
    if task_rate < 70:
        recommendations.append("Schedule a 1-on-1 mentorship session to resolve task blockers.")
    if req.study_hours_weekly < 6:
        recommendations.append("Increase weekly active learning hours to maintain program pace.")
    if not recommendations:
        recommendations.append("Maintain current momentum and take advanced milestone challenges!")

    return StudentProgressResponse(
        student_id=req.student_id,
        overall_progress_pct=round(overall, 2),
        learning_velocity_score=round(overall * 1.05, 2),
        quiz_average=round(quiz_avg, 2),
        task_completion_rate=round(task_rate, 2),
        engagement_level=engagement,
        strengths=strengths,
        recommendations=recommendations
    )

def analyze_project_progress(req: ProjectProgressRequest) -> ProjectProgressResponse:
    total_tasks = req.tasks_pending + req.tasks_in_progress + req.tasks_completed
    completion_pct = (req.tasks_completed / total_tasks * 100.0) if total_tasks > 0 else 0.0
    
    if completion_pct >= 75:
        health = "HEALTHY"
        blocker = "LOW"
        days_left = 5
    elif completion_pct >= 40:
        health = "ON_TRACK"
        blocker = "MODERATE"
        days_left = 12
    else:
        health = "BEHIND_SCHEDULE"
        blocker = "HIGH"
        days_left = 22

    insights = [
        f"Completed {req.tasks_completed} of {total_tasks} total project tasks.",
        f"Submitted {req.submission_count} evidence items for mentor review."
    ]
    if req.tasks_pending > req.tasks_completed:
        insights.append("Pending backlog is higher than completed milestones. Prioritize upcoming deliverables.")

    return ProjectProgressResponse(
        project_id=req.project_id,
        completion_percentage=round(completion_pct, 2),
        health_status=health,
        blocker_risk=blocker,
        predicted_completion_days=days_left,
        insights=insights
    )

def benchmark_batch_performance(req: PerformanceBenchmarkingRequest) -> PerformanceBenchmarkingResponse:
    if not req.student_data:
        return PerformanceBenchmarkingResponse(
            institution_id=req.institution_id,
            batch_name=req.batch_name,
            total_students=0,
            average_performance_score=0.0,
            top_performers_count=0,
            at_risk_students_count=0,
            class_attendance_average=0.0,
            performance_distribution={"A": 0, "B": 0, "C": 0, "F": 0}
        )

    df = pd.DataFrame(req.student_data)
    avg_score = float(df['score'].mean())
    avg_attendance = float(df['attendance_pct'].mean()) if 'attendance_pct' in df.columns else 85.0
    
    top_performers = int((df['score'] >= 85).sum())
    at_risk = int((df['score'] < 60).sum())
    
    grade_a = int((df['score'] >= 85).sum())
    grade_b = int(((df['score'] >= 70) & (df['score'] < 85)).sum())
    grade_c = int(((df['score'] >= 60) & (df['score'] < 70)).sum())
    grade_f = int((df['score'] < 60).sum())

    return PerformanceBenchmarkingResponse(
        institution_id=req.institution_id,
        batch_name=req.batch_name,
        total_students=len(df),
        average_performance_score=round(avg_score, 2),
        top_performers_count=top_performers,
        at_risk_students_count=at_risk,
        class_attendance_average=round(avg_attendance, 2),
        performance_distribution={
            "A (85%+)": grade_a,
            "B (70-84%)": grade_b,
            "C (60-69%)": grade_c,
            "F (<60%)": grade_f
        }
    )

def generate_student_report(req: ReportRequest) -> ReportResponse:
    report_id = f"REP-{datetime.now().strftime('%Y%m%d')}-{req.student_id[:6]}"
    task_rate = (req.tasks_done / req.total_tasks * 100.0) if req.total_tasks > 0 else 0.0
    
    highlights = [
        f"Achieved {req.learning_progress_pct}% overall course completion.",
        f"Completed {req.tasks_done}/{req.total_tasks} project tasks ({round(task_rate, 1)}%).",
        f"Project Status: {req.project_status}"
    ]
    
    improvements = []
    if req.learning_progress_pct < 70:
        improvements.append("Dedicate 2 more hours weekly to lesson modules.")
    if task_rate < 80:
        improvements.append("Submit pending project deliverables before upcoming deadlines.")
    if not improvements:
        improvements.append("Maintain exemplary performance across active milestones!")

    summary_html = f"""
    <div style="font-family: sans-serif; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px;">
        <h2 style="color: #1e3a8a;">{req.period.capitalize()} Progress Report for {req.student_name}</h2>
        <p><strong>Report ID:</strong> {report_id}</p>
        <p><strong>Course Progress:</strong> {req.learning_progress_pct}%</p>
        <p><strong>Tasks Completed:</strong> {req.tasks_done} of {req.total_tasks}</p>
        <p><strong>Project Status:</strong> {req.project_status}</p>
        <p><strong>Mentor Feedback:</strong> {req.mentor_notes or 'Consistently demonstrating good technical skills.'}</p>
    </div>
    """

    return ReportResponse(
        report_id=report_id,
        generated_at=datetime.now().isoformat(),
        student_id=req.student_id,
        period=req.period,
        summary_html=summary_html,
        key_highlights=highlights,
        areas_for_improvement=improvements
    )
