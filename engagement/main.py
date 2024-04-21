from fastapi import FastAPI
from controller.engagementController import engagement_router

app = FastAPI()

app.include_router(engagement_router, prefix = "/api/engagement")
