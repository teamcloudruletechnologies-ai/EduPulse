from fastapi import APIRouter
from models.schemas import (
    StudentProgressRequest, StudentProgressResponse,
    ProjectProgressRequest, ProjectProgressResponse,
    PerformanceBenchmarkingRequest, PerformanceBenchmarkingResponse
)
from services.pandas_analytics import (
    analyze_student_progress,
    analyze_project_progress,
    benchmark_batch_performance
)

router = APIRouter(prefix="/analytics", tags=["Analytics"])

@router.post("/student-progress", response_model=StudentProgressResponse)
def get_student_progress(req: StudentProgressRequest):
    return analyze_student_progress(req)

@router.post("/project-progress", response_model=ProjectProgressResponse)
def get_project_progress(req: ProjectProgressRequest):
    return analyze_project_progress(req)

@router.post("/performance", response_model=PerformanceBenchmarkingResponse)
def get_performance_benchmark(req: PerformanceBenchmarkingRequest):
    return benchmark_batch_performance(req)
