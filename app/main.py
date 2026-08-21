from pathlib import Path
from fastapi.middleware.cors import CORSMiddleware

from fastapi import FastAPI, Request
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from fastapi.responses import HTMLResponse

from app.routes.api import router


BASE_DIR = Path(__file__).resolve().parent


app = FastAPI(
    title="SkillGraph",
    description="Developer skills and learning path explorer",
    version="1.0.0",
)

# ============================================================
# CORS
# ============================================================

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "https://skillgraph-theta.vercel.app",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


app.mount(
    "/static",
    StaticFiles(directory=BASE_DIR / "static"),
    name="static",
)


templates = Jinja2Templates(
    directory=BASE_DIR / "templates"
)


app.include_router(router)


@app.get("/")
def dashboard(request: Request):
    return templates.TemplateResponse(
        request=request,
        name="dashboard.html",
        context={},
    )


@app.get("/learning-path", response_class=HTMLResponse)
def learning_path_page(request: Request):
    return templates.TemplateResponse(
        request=request,
        name="learning_path.html",
        context={},
    )


@app.get("/developers")
def developers_page(request: Request):
    return templates.TemplateResponse(
        request=request,
        name="developers.html",
        context={},
    )


@app.get("/developers/{name}")
def developer_page(request: Request, name: str):
    return templates.TemplateResponse(
        request=request,
        name="developer.html",
        context={
            "developer_name": name,
        },
    )


@app.get("/skills")
def skills_page(request: Request):
    return templates.TemplateResponse(
        request=request,
        name="skills.html",
        context={},
    )


@app.get("/skills/{name}")
def skill_page(request: Request, name: str):
    return templates.TemplateResponse(
        request=request,
        name="skill.html",
        context={
            "skill_name": name,
        },
    )


@app.get("/health")
def health_check():
    return {
        "status": "ok",
        "service": "SkillGraph",
    }
