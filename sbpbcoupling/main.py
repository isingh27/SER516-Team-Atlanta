from fastapi import FastAPI
from controller.sbPbCouplingController import sp_pb_coupling_router

app = FastAPI()

app.include_router(sp_pb_coupling_router , prefix='/api/SbPbCoupling')



