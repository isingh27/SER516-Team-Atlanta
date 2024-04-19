from fastapi import FastAPI
from controller.costofdelay_controller import cost_of_delay_router

app = FastAPI()
app.include_router(cost_of_delay_router, prefix='/api/cost_of_delay')
