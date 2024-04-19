from fastapi import APIRouter, Header, Request, HTTPException

from service.task_service import get_cost_of_delay_for_sprint

cost_of_delay_router = APIRouter()
    
@cost_of_delay_router.get("/get_cost_of_delay")
def get_cost_of_delay(request: Request, project_id: int, sprint_id: int, business_value_cost_factor: int):
    auth_token = request.headers.get('Authorization')

    if (auth_token):
        return get_cost_of_delay_for_sprint(project_id, sprint_id, business_value_cost_factor, auth_token)
    else:
        raise HTTPException(status_code = 401, detail = "Missing or invalid access token")
