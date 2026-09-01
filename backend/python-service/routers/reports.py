from fastapi import APIRouter
from models.schemas import ReportRequest, ReportResponse
from services.pandas_analytics import generate_student_report

router = APIRouter(prefix="/reports", tags=["Reports"])

@router.post("/weekly", response_model=ReportResponse)
def get_weekly_report(req: ReportRequest):
    req.period = "WEEKLY"
    return generate_student_report(req)

@router.post("/monthly", response_model=ReportResponse)
def get_monthly_report(req: ReportRequest):
    req.period = "MONTHLY"
    return generate_student_report(req)
