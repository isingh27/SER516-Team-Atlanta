from fastapi import FastAPI
from controller.taskCouplingController import task_coupling_router


app = FastAPI()

app.include_router(task_coupling_router, prefix='/api/taskCoupling')

