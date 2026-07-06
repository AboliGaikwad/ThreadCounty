from pydantic import BaseModel
from typing import Optional

class AnalysisResult(BaseModel):
    fabric_type: str
    thread_density: int
    warp_count: int
    weft_count: int
    confidence_score: float
    ai_suggestions: str

class AdminStatsResponse(BaseModel):
    total_users: int
    total_uploads: int
    total_analyses: int