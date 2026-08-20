from typing import List

from fastapi import APIRouter, HTTPException, Query
from pydantic import BaseModel

from app.services.graph_service import (
    get_dashboard_stats,
    get_developer,
    get_all_developers,
    get_skill,
    get_all_skills,
    find_learning_path,
    get_project,
    get_all_projects,
    find_developers_for_project_skill,
    get_skill_details,
    create_developer,
)

router = APIRouter(prefix="/api")


# ==========================================
# REQUEST MODELS
# ==========================================

class DeveloperCreate(BaseModel):
    name: str
    role: str
    email: str = ""
    location: str = ""
    experience: str = ""
    bio: str = ""
    skills: List[str] = []
    projects: List[str] = []


# ==========================================
# DASHBOARD
# ==========================================

@router.get("/stats")
def dashboard_stats():
    return get_dashboard_stats()


# ==========================================
# DEVELOPERS
# ==========================================

@router.get("/developers")
def developers():
    return get_all_developers()


@router.post("/developers")
def create_developer_route(developer: DeveloperCreate):

    try:

        result = create_developer(developer)

        if result is None:
            raise HTTPException(
                status_code=500,
                detail="Developer could not be created",
            )

        return result

    except HTTPException:
        raise

    except Exception as exc:

        print(
            f"Failed to create developer: {exc}"
        )

        raise HTTPException(
            status_code=500,
            detail="Unable to create developer",
        )

@router.get("/developers/{name}")
def developer(name: str):

    result = get_developer(name)

    if result is None:
        raise HTTPException(
            status_code=404,
            detail="Developer not found",
        )

    return result


# ==========================================
# SKILLS
# ==========================================

@router.get("/skills")
def skills():
    return get_all_skills()


@router.get("/skills/{name}")
def skill(name: str):

    result = get_skill(name)

    if result is None:
        raise HTTPException(
            status_code=404,
            detail="Skill not found",
        )

    return result


# ==========================================
# LEARNING PATH
# ==========================================

@router.get("/learning-path")
def learning_path(
    start: str = Query(...),
    target: str = Query(...),
):

    if start == target:
        raise HTTPException(
            status_code=400,
            detail="Start and target skills must be different",
        )

    return {
        "start": start,
        "target": target,
        "paths": find_learning_path(
            start,
            target
        ),
    }


# ==========================================
# PROJECTS
# ==========================================

@router.get("/projects")
def projects():
    return get_all_projects()


@router.get("/projects/{name}")
def project(name: str):

    result = get_project(name)

    if result is None:
        raise HTTPException(
            status_code=404,
            detail="Project not found",
        )

    return result


@router.get("/projects/{name}/developers")
def project_developers(name: str):

    return find_developers_for_project_skill(name)


# ==========================================
# SKILL DETAILS
# ==========================================

@router.get("/skills/{name}/details")
def skill_details(name: str):

    try:

        result = get_skill_details(name)

        if not result:
            raise HTTPException(
                status_code=404,
                detail="Skill not found",
            )

        row = result[0]

        return {
            "name": row["skill"],
            "developers": row["developers"],
            "projects": row["projects"],
            "related_skills": row["related_skills"],
        }

    except HTTPException:
        raise

    except Exception as exc:

        print(
            f"Skill query failed: {exc}"
        )

        raise HTTPException(
            status_code=500,
            detail="Unable to load skill",
        )