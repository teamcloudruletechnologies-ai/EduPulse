from fastapi import APIRouter
from models.schemas import (
    SubmissionAnalysisRequest,
    SubmissionAnalysisResponse,
    CodeExplanationRequest,
    CodeExplanationResponse
)
from services.ai_analysis import analyze_submission_ai
from services.code_explainer import analyze_code_with_python

router = APIRouter(prefix="/analysis", tags=["AI Analysis"])

@router.post("/submission", response_model=SubmissionAnalysisResponse)
def get_submission_analysis(req: SubmissionAnalysisRequest):
    return analyze_submission_ai(req)

@router.post("/code", response_model=SubmissionAnalysisResponse)
def get_code_analysis(req: SubmissionAnalysisRequest):
    req.submission_type = "CODE"
    return analyze_submission_ai(req)

@router.post("/explain-code", response_model=CodeExplanationResponse)
def explain_code_endpoint(req: CodeExplanationRequest):
    return analyze_code_with_python(code=req.code, language=req.language, inputs=req.inputs)
