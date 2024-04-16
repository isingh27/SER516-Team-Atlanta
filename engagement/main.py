from fastapi import FastAPI
from controller.engagementController import engagement_router

app = FastAPI()
print("IN THE MAIN")
app.include_router(engagement_router, prefix = "/api/engagement")
