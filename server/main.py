from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from routers import auth, problems, stats, sync, tasks

app = FastAPI(title="DSA Tracker Pro API")

app.include_router(auth.router)
app.include_router(problems.router)
app.include_router(stats.router)
app.include_router(sync.router)
app.include_router(tasks.router)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    return {"message": "Welcome to DSA Tracker Pro API"}

if __name__ == "__main__":
    import uvicorn
    import os
    port = int(os.getenv("PORT", 7860))
    uvicorn.run(app, host="0.0.0.0", port=port)
