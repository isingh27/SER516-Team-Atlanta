from fastapi import HTTPException
from taigaApi.project.getProjectBySlug import get_project_by_slug

def get_sprint_details_from_project_id(project_slug, auth_token):
    
    response = {}
    try: 
        project_info = get_project_by_slug(project_slug, auth_token)
        project_id = project_info['id']
        response[project_id] = project_info['milestones']

        return response
    
    except Exception as e:
        raise HTTPException(status_code=401, detail="{e}")


