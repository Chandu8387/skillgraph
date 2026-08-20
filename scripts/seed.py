#from app.database import execute_query
from app.database import execute_query


def seed_database():
    # Clear existing data so the script is safe to run again.
    execute_query("""
        MATCH (n)
        DETACH DELETE n
    """)

    # -------------------------
    # Developers
    # -------------------------
    developers = [
        {
            "name": "Arjun",
            "role": "Backend Developer",
            "experience": 4,
        },
        {
            "name": "Priya",
            "role": "Full-Stack Developer",
            "experience": 3,
        },
        {
            "name": "Rahul",
            "role": "Data Engineer",
            "experience": 5,
        },
        {
            "name": "Ananya",
            "role": "Frontend Developer",
            "experience": 2,
        },
        {
            "name": "Vikram",
            "role": "Backend Developer",
            "experience": 6,
        },
    ]

    for developer in developers:
        execute_query(
            """
            CREATE (:Developer {
                name: $name,
                role: $role,
                experience: $experience
            })
            """,
            developer,
        )

    # -------------------------
    # Skills
    # -------------------------
    skills = [
        "Python",
        "JavaScript",
        "HTML",
        "CSS",
        "SQL",
        "REST APIs",
        "Django",
        "FastAPI",
        "React",
        "Data Analysis",
        "Machine Learning",
        "Docker",
    ]

    for skill in skills:
        execute_query(
            """
            CREATE (:Skill {name: $name})
            """,
            {"name": skill},
        )

    # -------------------------
    # Technologies
    # -------------------------
    technologies = [
        "MySQL",
        "PostgreSQL",
        "Git",
        "GitHub",
        "Docker",
        "AWS",
    ]

    for technology in technologies:
        execute_query(
            """
            CREATE (:Technology {name: $name})
            """,
            {"name": technology},
        )

    # -------------------------
    # Projects
    # -------------------------
    projects = [
        {
            "name": "Food Ordering Platform",
            "description": "A web platform for restaurants and online food ordering.",
        },
        {
            "name": "Employee Management System",
            "description": "An internal system for managing employees and departments.",
        },
        {
            "name": "Job Recommendation Engine",
            "description": "A system that recommends jobs based on candidate skills.",
        },
        {
            "name": "Analytics Dashboard",
            "description": "A dashboard for exploring business performance data.",
        },
        {
            "name": "Learning Management Platform",
            "description": "A platform connecting learners with courses and resources.",
        },
    ]

    for project in projects:
        execute_query(
            """
            CREATE (:Project {
                name: $name,
                description: $description
            })
            """,
            project,
        )

    # -------------------------
    # Resources
    # -------------------------
    resources = [
        {
            "title": "Python Official Documentation",
            "type": "Documentation",
            "url": "https://docs.python.org/3/",
        },
        {
            "title": "Django Documentation",
            "type": "Documentation",
            "url": "https://docs.djangoproject.com/",
        },
        {
            "title": "FastAPI Documentation",
            "type": "Documentation",
            "url": "https://fastapi.tiangolo.com/",
        },
        {
            "title": "React Documentation",
            "type": "Documentation",
            "url": "https://react.dev/",
        },
        {
            "title": "Docker Get Started",
            "type": "Tutorial",
            "url": "https://docs.docker.com/get-started/",
        },
    ]

    for resource in resources:
        execute_query(
            """
            CREATE (:Resource {
                title: $title,
                type: $type,
                url: $url
            })
            """,
            resource,
        )

    # -------------------------
    # Developer -> Skill
    # -------------------------
    developer_skills = [
        ("Arjun", "Python"),
        ("Arjun", "Django"),
        ("Arjun", "REST APIs"),
        ("Arjun", "SQL"),
        ("Arjun", "Docker"),

        ("Priya", "Python"),
        ("Priya", "JavaScript"),
        ("Priya", "React"),
        ("Priya", "HTML"),
        ("Priya", "CSS"),
        ("Priya", "REST APIs"),

        ("Rahul", "Python"),
        ("Rahul", "SQL"),
        ("Rahul", "Data Analysis"),
        ("Rahul", "Machine Learning"),
        ("Rahul", "Docker"),

        ("Ananya", "JavaScript"),
        ("Ananya", "React"),
        ("Ananya", "HTML"),
        ("Ananya", "CSS"),

        ("Vikram", "Python"),
        ("Vikram", "FastAPI"),
        ("Vikram", "REST APIs"),
        ("Vikram", "SQL"),
        ("Vikram", "Docker"),
    ]

    for developer_name, skill_name in developer_skills:
        execute_query(
            """
            MATCH (d:Developer {name: $developer_name})
            MATCH (s:Skill {name: $skill_name})
            CREATE (d)-[:KNOWS]->(s)
            """,
            {
                "developer_name": developer_name,
                "skill_name": skill_name,
            },
        )

    # -------------------------
    # Skill prerequisites
    # -------------------------
    prerequisites = [
        ("Python", "Django"),
        ("Python", "FastAPI"),
        ("HTML", "React"),
        ("CSS", "React"),
        ("Python", "Data Analysis"),
        ("Python", "Machine Learning"),
        ("SQL", "Data Analysis"),
        ("Data Analysis", "Machine Learning"),
        ("Python", "REST APIs"),
        ("REST APIs", "Django"),
        ("REST APIs", "FastAPI"),
        ("Python", "Docker"),
    ]

    for source_skill, target_skill in prerequisites:
        execute_query(
            """
            MATCH (source:Skill {name: $source_skill})
            MATCH (target:Skill {name: $target_skill})
            CREATE (source)-[:PREREQUISITE_OF]->(target)
            """,
            {
                "source_skill": source_skill,
                "target_skill": target_skill,
            },
        )

    # -------------------------
    # Related skills
    # -------------------------
    related_skills = [
        ("Django", "FastAPI"),
        ("JavaScript", "React"),
        ("Python", "SQL"),
        ("Docker", "REST APIs"),
    ]

    for skill_a, skill_b in related_skills:
        execute_query(
            """
            MATCH (a:Skill {name: $skill_a})
            MATCH (b:Skill {name: $skill_b})
            CREATE (a)-[:RELATED_TO]->(b)
            """,
            {
                "skill_a": skill_a,
                "skill_b": skill_b,
            },
        )

    # -------------------------
    # Projects -> Technologies
    # -------------------------
    project_technologies = [
        ("Food Ordering Platform", "MySQL"),
        ("Food Ordering Platform", "Git"),
        ("Food Ordering Platform", "GitHub"),
        ("Food Ordering Platform", "Docker"),

        ("Employee Management System", "PostgreSQL"),
        ("Employee Management System", "Git"),
        ("Employee Management System", "GitHub"),

        ("Job Recommendation Engine", "PostgreSQL"),
       # ("Job Recommendation Engine", "Python"),
        ("Job Recommendation Engine", "Docker"),

        ("Analytics Dashboard", "PostgreSQL"),
        ("Analytics Dashboard", "AWS"),

        ("Learning Management Platform", "MySQL"),
        ("Learning Management Platform", "Docker"),
        ("Learning Management Platform", "GitHub"),
    ]

    # Only create relationships for technologies that exist as nodes.
    # Python is represented as a Skill, not a Technology.
    for project_name, technology_name in project_technologies:
        result = execute_query(
            """
            MATCH (p:Project {name: $project_name})
            MATCH (t:Technology {name: $technology_name})
            CREATE (p)-[:USES]->(t)
            """,
            {
                "project_name": project_name,
                "technology_name": technology_name,
            },
        )

    # -------------------------
    # Projects -> Skills
    # -------------------------
    project_skills = [
        ("Food Ordering Platform", "Python"),
        ("Food Ordering Platform", "Django"),
        ("Food Ordering Platform", "REST APIs"),
        ("Food Ordering Platform", "SQL"),

        ("Employee Management System", "Python"),
        ("Employee Management System", "Django"),
        ("Employee Management System", "SQL"),

        ("Job Recommendation Engine", "Python"),
        ("Job Recommendation Engine", "Machine Learning"),
        ("Job Recommendation Engine", "Data Analysis"),

        ("Analytics Dashboard", "Python"),
        ("Analytics Dashboard", "Data Analysis"),
        ("Analytics Dashboard", "SQL"),

        ("Learning Management Platform", "Python"),
        ("Learning Management Platform", "FastAPI"),
        ("Learning Management Platform", "REST APIs"),
    ]

    for project_name, skill_name in project_skills:
        execute_query(
            """
            MATCH (p:Project {name: $project_name})
            MATCH (s:Skill {name: $skill_name})
            CREATE (p)-[:REQUIRES]->(s)
            """,
            {
                "project_name": project_name,
                "skill_name": skill_name,
            },
        )

    # -------------------------
    # Resources -> Skills
    # -------------------------
    resources_skills = [
        ("Python Official Documentation", "Python"),
        ("Django Documentation", "Django"),
        ("FastAPI Documentation", "FastAPI"),
        ("React Documentation", "React"),
        ("Docker Get Started", "Docker"),
    ]

    for resource_title, skill_name in resources_skills:
        execute_query(
            """
            MATCH (r:Resource {title: $resource_title})
            MATCH (s:Skill {name: $skill_name})
            CREATE (r)-[:TEACHES]->(s)
            """,
            {
                "resource_title": resource_title,
                "skill_name": skill_name,
            },
        )

    # -------------------------
    # Developer -> Project
    # -------------------------
    developer_projects = [
        ("Arjun", "Food Ordering Platform"),
        ("Arjun", "Employee Management System"),
        ("Priya", "Food Ordering Platform"),
        ("Priya", "Learning Management Platform"),
        ("Rahul", "Job Recommendation Engine"),
        ("Rahul", "Analytics Dashboard"),
        ("Ananya", "Learning Management Platform"),
        ("Vikram", "Employee Management System"),
        ("Vikram", "Job Recommendation Engine"),
    ]

    for developer_name, project_name in developer_projects:
        execute_query(
            """
            MATCH (d:Developer {name: $developer_name})
            MATCH (p:Project {name: $project_name})
            CREATE (d)-[:WORKED_ON]->(p)
            """,
            {
                "developer_name": developer_name,
                "project_name": project_name,
            },
        )

    print("Database seeded successfully.")


if __name__ == "__main__":
    seed_database()