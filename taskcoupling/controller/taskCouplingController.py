from fastapi import APIRouter, Header, Request, HTTPException

from service.taskCouplingService import get_task_coupling

task_coupling_router= APIRouter()

@task_coupling_router.get('/task_coupling')
def get_task_coupling_response(request:Request, project_id: int):
    auth_token = request.headers.get('Authorization')
    
    if (auth_token):
        return get_task_coupling(project_id, auth_token)
    else:
        raise HTTPException(status_code = 401, detail = "Missing or invalid access token")

