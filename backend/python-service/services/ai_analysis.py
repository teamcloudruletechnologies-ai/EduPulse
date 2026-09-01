from models.schemas import SubmissionAnalysisRequest, SubmissionAnalysisResponse

def analyze_submission_ai(req: SubmissionAnalysisRequest) -> SubmissionAnalysisResponse:
    desc_len = len(req.description)
    has_github = bool(req.github_url and "github.com" in req.github_url.lower())
    has_file = bool(req.file_url)

    # Base completeness score
    score = 50.0
    if desc_len >= 100:
        score += 25.0
    elif desc_len >= 40:
        score += 15.0

    if has_github or has_file:
        score += 25.0

    syntax_issues = []
    formatting_issues = []

    if not has_github and req.submission_type == "CODE":
        syntax_issues.append("Missing GitHub Repository URL link for verification.")
        
    if desc_len < 50:
        formatting_issues.append("Submission description is concise. Provide technical breakdown and features implemented.")

    if score >= 85:
        recommendation = "RECOMMEND_APPROVAL"
        grade = "A"
        suggested_action = "Approve submission and reward project milestone achievement."
    elif score >= 65:
        recommendation = "RECOMMEND_APPROVAL_WITH_NOTES"
        grade = "B"
        suggested_action = "Approve submission, request minor documentation additions in next iteration."
    else:
        recommendation = "RECOMMEND_REVISION"
        grade = "C"
        suggested_action = "Request student revision: upload code evidence or expand project technical summary."

    return SubmissionAnalysisResponse(
        submission_id=req.submission_id,
        completeness_score=round(score, 2),
        ai_recommendation=recommendation,
        code_quality_grade=grade,
        syntax_issues_found=syntax_issues,
        formatting_issues=formatting_issues,
        mentor_action_suggested=suggested_action
    )
