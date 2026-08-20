const API_BASE_URL = "http://127.0.0.1:8000";


async function request(
    endpoint,
    options = {}
) {

    console.log(
        "API REQUEST:",
        endpoint,
        options
    );


    const response = await fetch(
        `${API_BASE_URL}${endpoint}`,
        {
            ...options,

            headers: {
                "Content-Type": "application/json",

                ...(options.headers || {}),
            },
        }
    );


    console.log(
        "API RESPONSE:",
        response.status,
        endpoint
    );


    if (!response.ok) {

        const text =
            await response.text();

        console.error(
            "API ERROR:",
            response.status,
            text
        );

        throw new Error(
            `API ${response.status}: ${text}`
        );
    }


    return response.json();
}


// ============================================================
// DASHBOARD
// ============================================================

export function getStats() {

    return request(
        "/api/stats"
    );
}


// ============================================================
// DEVELOPERS
// ============================================================

export function getDevelopers() {

    return request(
        "/api/developers"
    );
}


export function getDeveloper(
    name
) {

    return request(
        `/api/developers/${encodeURIComponent(name)}`
    );
}


export function createDeveloper(
    developer
) {

    return request(
        "/api/developers",
        {
            method: "POST",

            body: JSON.stringify(
                developer
            ),
        }
    );
}


// ============================================================
// SKILLS
// ============================================================

export function getSkills() {

    return request(
        "/api/skills"
    );
}


export function getSkill(
    name
) {

    return request(
        `/api/skills/${encodeURIComponent(name)}`
    );
}


// ============================================================
// PROJECTS
// ============================================================

export function getProjects() {

    return request(
        "/api/projects"
    );
}


export function getProject(
    name
) {

    return request(
        `/api/projects/${encodeURIComponent(name)}`
    );
}


// ============================================================
// LEARNING PATH
// ============================================================

export function getLearningPath(
    start,
    target
) {

    return request(
        `/api/learning-path?start=${encodeURIComponent(start)}&target=${encodeURIComponent(target)}`
    );
}


export function findLearningPath(
    start,
    target
) {

    return request(
        `/api/learning-path?start=${encodeURIComponent(start)}&target=${encodeURIComponent(target)}`
    );
}