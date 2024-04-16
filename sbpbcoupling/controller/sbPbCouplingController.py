from fastapi import APIRouter, Header, Request, HTTPException

from service.sbPbCouplingService import get_pb_coupling, get_sb_coupling

sp_pb_coupling_router = APIRouter()

@sp_pb_coupling_router.get("/sb_coupling")
def get_sprint_backlog_coupling(request:Request, sprint_id: int):
    access_token = request.headers.get('Authorization')
    if(access_token):
        return get_sb_coupling(sprint_id, access_token)
    else:
        raise HTTPException(status_code=401, detail="Missing or invalid access token")
    

@sp_pb_coupling_router.get("/pb_coupling")
def get_product_backlog_coupling(request:Request, project_id: int):
    access_token = request.headers.get('Authorization')
    if(access_token):
        return get_pb_coupling(project_id, access_token)
    else:
        raise HTTPException(status_code=401, detail="Missing or invalid access token")
