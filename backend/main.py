from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import analysis, admin, reports

app = FastAPI(title="ThreadCounty API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "https://thread-county-one.vercel.app",  # update when deployed
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(analysis.router)
app.include_router(admin.router)
app.include_router(reports.router)

@app.get("/health")
def health():
    return {"status": "ok"}