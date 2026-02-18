import logging
import traceback
from contextlib import asynccontextmanager

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from app.database import create_tables
from app.routers import auth, accounts, transactions, transfers, categories, debts, budgets, analytics

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI):
    await create_tables()
    yield


app = FastAPI(
    title="Personal Finance API",
    description="A comprehensive personal finance management API",
    version="1.0.0",
    lifespan=lifespan,
)


@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    tb = traceback.format_exception(type(exc), exc, exc.__traceback__)
    logger.error(f"Unhandled exception on {request.url}:\n{''.join(tb)}")
    return JSONResponse(status_code=500, content={"detail": str(exc)})

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(accounts.router)
app.include_router(transactions.router)
app.include_router(transfers.router)
app.include_router(categories.router)
app.include_router(debts.router)
app.include_router(budgets.router)
app.include_router(analytics.router)


@app.get("/")
async def root():
    return {"message": "Personal Finance API", "docs": "/docs"}
