from app.database import execute_query


# ============================================================
# DASHBOARD
# ============================================================

def get_dashboard_stats():

    query = """
    MATCH (d:Developer)
    WITH count(d) AS developers

    MATCH (s:Skill)
    WITH developers, count(s) AS skills

    MATCH (t:Technology)
    WITH developers, skills, count(t) AS technologies

    MATCH (p:Project)

    RETURN
        developers,
        skills,
        technologies,
        count(p) AS projects
    """

    result = execute_query(query)

    if not result:
        return {
            "developers": 0,
            "skills": 0,
            "technologies": 0,
            "projects": 0,
        }

    return result[0]


# ============================================================
# DEVELOPERS
# ============================================================

def get_all_developers():

    query = """
    MATCH (d:Developer)

    RETURN
        d.name AS name,
        d.role AS role,
        d.experience AS experience

    ORDER BY d.name
    """

    return execute_query(query)


def get_developer(name):

    query = """
    MATCH (d:Developer {name: $name})

    OPTIONAL MATCH (d)-[:KNOWS]->(s:Skill)

    OPTIONAL MATCH (d)-[:WORKED_ON]->(p:Project)

    RETURN
        d.name AS name,
        d.role AS role,
        d.email AS email,
        d.location AS location,
        d.experience AS experience,
        d.bio AS bio,

        collect(DISTINCT s.name) AS skills,

        collect(
            DISTINCT CASE
                WHEN p IS NULL THEN NULL
                ELSE {
                    name: p.name,
                    description: p.description
                }
            END
        ) AS projects
    """

    result = execute_query(
        query,
        {"name": name},
    )

    if not result:
        return None

    developer = result[0]

    # Remove null project values
    developer["projects"] = [
        project
        for project in developer["projects"]
        if project is not None
    ]

    return developer


def create_developer(developer):

    # ========================================================
    # 1. CREATE / UPDATE DEVELOPER
    # ========================================================

    developer_query = """
    MERGE (d:Developer {name: $name})

    SET
        d.role = $role,
        d.email = $email,
        d.location = $location,
        d.experience = $experience,
        d.bio = $bio

    RETURN
        d.name AS name,
        d.role AS role,
        d.email AS email,
        d.location AS location,
        d.experience AS experience,
        d.bio AS bio
    """

    developer_result = execute_query(
        developer_query,
        {
            "name": developer.name,
            "role": developer.role,
            "email": developer.email,
            "location": developer.location,
            "experience": developer.experience,
            "bio": developer.bio,
        },
    )

    if not developer_result:
        raise RuntimeError(
            "Developer was not created"
        )

    # ========================================================
    # 2. CONNECT SKILLS
    # ========================================================

    if developer.skills:

        skills_query = """
        MATCH (d:Developer {name: $name})

        UNWIND $skills AS skill_name

        MERGE (s:Skill {name: skill_name})

        MERGE (d)-[:KNOWS]->(s)

        RETURN collect(DISTINCT s.name) AS skills
        """

        skills_result = execute_query(
            skills_query,
            {
                "name": developer.name,
                "skills": developer.skills,
            },
        )

    else:

        skills_result = []


    # ========================================================
    # 3. CONNECT PROJECTS
    # ========================================================

    if developer.projects:

        projects_query = """
        MATCH (d:Developer {name: $name})

        UNWIND $projects AS project_name

        MERGE (p:Project {name: project_name})

        MERGE (d)-[:WORKED_ON]->(p)

        RETURN collect(DISTINCT p.name) AS projects
        """

        projects_result = execute_query(
            projects_query,
            {
                "name": developer.name,
                "projects": developer.projects,
            },
        )

    else:

        projects_result = []


    # ========================================================
    # 4. RETURN CREATED DEVELOPER
    # ========================================================

    return {
        **developer_result[0],

        "skills": (
            skills_result[0]["skills"]
            if skills_result
            else []
        ),

        "projects": (
            projects_result[0]["projects"]
            if projects_result
            else []
        ),
    }


# ============================================================
# SKILLS
# ============================================================

def get_all_skills():

    query = """
    MATCH (s:Skill)

    RETURN
        s.name AS name

    ORDER BY s.name
    """

    return execute_query(query)


def get_skill(name):

    query = """
    MATCH (s:Skill {name: $name})

    OPTIONAL MATCH (d:Developer)-[:KNOWS]->(s)

    OPTIONAL MATCH (s)-[:RELATED_TO]->(related:Skill)

    OPTIONAL MATCH (s)-[:PREREQUISITE_OF]->(next:Skill)

    OPTIONAL MATCH (p:Project)-[:REQUIRES]->(s)

    OPTIONAL MATCH (r:Resource)-[:TEACHES]->(s)

    RETURN
        s.name AS name,

        collect(DISTINCT d.name) AS developers,

        collect(DISTINCT related.name) AS related_skills,

        collect(DISTINCT next.name) AS next_skills,

        collect(DISTINCT p.name) AS projects,

        collect(
            DISTINCT {
                title: r.title,
                type: r.type,
                url: r.url
            }
        ) AS resources
    """

    result = execute_query(
        query,
        {"name": name},
    )

    if not result:
        return None

    return result[0]


def get_skill_details(skill_name):

    params = {
        "skill_name": skill_name
    }

    # --------------------------------------------------------
    # FIND SKILL
    # --------------------------------------------------------

    skill_rows = execute_query(
        """
        MATCH (s:Skill {name: $skill_name})

        RETURN s.name AS skill
        """,
        params,
    )

    if not skill_rows:
        return None

    # --------------------------------------------------------
    # DEVELOPERS
    # --------------------------------------------------------

    developer_rows = execute_query(
        """
        MATCH
            (d:Developer)-[:KNOWS]->
            (s:Skill {name: $skill_name})

        RETURN DISTINCT d.name AS name

        ORDER BY name
        """,
        params,
    )

    # --------------------------------------------------------
    # PROJECTS
    # --------------------------------------------------------

    project_rows = execute_query(
        """
        MATCH
            (d:Developer)-[:KNOWS]->
            (s:Skill {name: $skill_name})

        MATCH
            (d)-[:WORKED_ON]->(p:Project)

        RETURN DISTINCT p.name AS name

        ORDER BY name
        """,
        params,
    )

    # --------------------------------------------------------
    # RELATED SKILLS
    # --------------------------------------------------------

    related_rows = execute_query(
        """
        MATCH
            (d:Developer)-[:KNOWS]->
            (s:Skill {name: $skill_name})

        MATCH
            (d)-[:KNOWS]->(related:Skill)

        WHERE related.name <> $skill_name

        RETURN DISTINCT related.name AS name

        ORDER BY name
        """,
        params,
    )

    return {
        "skill": skill_rows[0]["skill"],

        "developers": [
            row["name"]
            for row in developer_rows
            if row.get("name")
        ],

        "projects": [
            row["name"]
            for row in project_rows
            if row.get("name")
        ],

        "related_skills": [
            row["name"]
            for row in related_rows
            if row.get("name")
        ],
    }


# ============================================================
# PROJECTS
# ============================================================

def get_all_projects():

    query = """
    MATCH (p:Project)

    RETURN
        p.name AS name,
        p.description AS description

    ORDER BY p.name
    """

    return execute_query(query)


def get_project(name):

    query = """
    MATCH (p:Project {name: $name})

    OPTIONAL MATCH (p)-[:USES]->(t:Technology)

    OPTIONAL MATCH (p)-[:REQUIRES]->(s:Skill)

    OPTIONAL MATCH (d:Developer)-[:WORKED_ON]->(p)

    RETURN
        p.name AS name,
        p.description AS description,

        collect(DISTINCT t.name) AS technologies,

        collect(DISTINCT s.name) AS skills,

        collect(DISTINCT d.name) AS developers
    """

    result = execute_query(
        query,
        {"name": name},
    )

    if not result:
        return None

    return result[0]


def find_developers_for_project_skill(project_name):

    query = """
    MATCH
        (p:Project {name: $project_name})
        -[:REQUIRES]->
        (required:Skill)

    MATCH
        (d:Developer)
        -[:KNOWS]->
        (required)

    RETURN
        d.name AS developer,
        required.name AS matching_skill

    ORDER BY developer, matching_skill
    """

    return execute_query(
        query,
        {
            "project_name": project_name
        },
    )


# ============================================================
# LEARNING PATH
# ============================================================

def find_learning_path(
    start_skill,
    target_skill
):

    query = """
    MATCH path =
        (start:Skill {name: $start_skill})
        -[:PREREQUISITE_OF*1..5]->
        (target:Skill {name: $target_skill})

    RETURN
        [node IN nodes(path) | node.name] AS skills,
        length(path) AS hops

    ORDER BY hops

    LIMIT 5
    """

    return execute_query(
        query,
        {
            "start_skill": start_skill,
            "target_skill": target_skill,
        },
    )