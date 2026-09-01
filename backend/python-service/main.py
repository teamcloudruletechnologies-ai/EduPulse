from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import analytics, reports, analysis

app = FastAPI(
    title="EdTech Platform Python Microservice",
    description="FastAPI microservice for Pandas progress analytics, report generation, and AI pre-checks.",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(analytics.router)
app.include_router(reports.router)
app.include_router(analysis.router)

@app.get("/")
def read_root():
    return {
        "service": "EdTech Python Analytics Microservice",
        "status": "ONLINE",
        "documentation": "/docs"
    }

@app.get("/health")
def health_check():
    return {"status": "healthy"}
