from fastapi import APIRouter, UploadFile, File, HTTPException
from services.ai_service import analyze_fabric_image
from services.supabase_client import supabase

router = APIRouter(prefix="/analysis", tags=["analysis"])

ALLOWED_TYPES = {"image/jpeg", "image/jpg", "image/png"}

@router.post("/analyze/{upload_id}")
async def analyze(upload_id: str, file: UploadFile = File(...)):
    # Validate file type
    if file.content_type not in ALLOWED_TYPES:
        raise HTTPException(status_code=400, detail="Only JPG, JPEG, PNG allowed.")

    # Read image bytes
    image_bytes = await file.read()

    # Call Gemini
    result = await analyze_fabric_image(image_bytes, file.content_type)

    # Check if a result already exists for this upload (prevent duplicates)
    existing = supabase.from_("analysis_results").select("id").eq("upload_id", upload_id).execute()
    if existing.data:
        # Update instead of insert
        supabase.from_("analysis_results").update(result).eq("upload_id", upload_id).execute()
    else:
        supabase.from_("analysis_results").insert({
            "upload_id": upload_id,
            **result
        }).execute()

    # Mark upload as complete
    supabase.from_("uploads").update({"status": "complete"}).eq("id", upload_id).execute()

    # Log activity
    upload_row = supabase.from_("uploads").select("user_id, file_name").eq("id", upload_id).single().execute()
    if upload_row.data:
        supabase.from_("activity_log").insert({
            "user_id": upload_row.data["user_id"],
            "action": "analysis_complete",
            "description": f"Analysis complete for {upload_row.data['file_name']}"
        }).execute()

    return result