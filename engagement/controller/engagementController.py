from fastapi import APIRouter, Request, HTTPException

from service.engagement_service import get_engagement

engagement_router = APIRouter()

@engagement_router.get("/stats")
def get_user_engagement(request:Request, project_id:str):
    access_token = request.headers.get('Authorization')
    if(access_token):
        return get_engagement(project_id, access_token)
    else:
        raise HTTPException(status_code = 401, detail = "Missing or invalid access token")
