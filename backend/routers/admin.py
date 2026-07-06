from fastapi import APIRouter, HTTPException
from services.supabase_client import supabase

router = APIRouter(prefix="/admin", tags=["admin"])

def verify_admin(user_id: str):
    result = supabase.from_("admin_users").select("user_id").eq("user_id", user_id).execute()
    if not result.data:
        raise HTTPException(status_code=403, detail="Admin access required.")

@router.get("/stats")
def get_admin_stats(user_id: str):
    verify_admin(user_id)

    # auth.users is only accessible via service role — this is why this lives in the backend
    users = supabase.auth.admin.list_users()
    total_users = len(users)

    uploads = supabase.from_("uploads").select("*", count="exact").execute()
    analyses = supabase.from_("analysis_results").select("*", count="exact").execute()
    messages = supabase.from_("contact_messages").select("*").execute()

    return {
        "total_users": total_users,
        "total_uploads": uploads.count,
        "total_analyses": analyses.count,
        "contact_messages": messages.data or [],
    }

@router.delete("/uploads/{upload_id}")
def delete_upload(upload_id: str, user_id: str):
    verify_admin(user_id)
    upload = supabase.from_("uploads").select("image_url").eq("id", upload_id).single().execute()
    if upload.data:
        supabase.storage.from_("fabric-images").remove([upload.data["image_url"]])
    supabase.from_("uploads").delete().eq("id", upload_id).execute()
    return {"deleted": upload_id}

@router.delete("/users/{target_user_id}")
def delete_user(target_user_id: str, user_id: str):
    verify_admin(user_id)
    supabase.auth.admin.delete_user(target_user_id)
    return {"deleted": target_user_id}