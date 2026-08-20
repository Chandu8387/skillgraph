async function loadDashboardStats() {
    try {
        const response = await fetch("/api/stats");

        if (!response.ok) {
            throw new Error("Failed to load dashboard statistics");
        }

        const data = await response.json();

        document.getElementById("developer-count").textContent =
            data.developers;

        document.getElementById("skill-count").textContent =
            data.skills;

        document.getElementById("technology-count").textContent =
            data.technologies;

        document.getElementById("project-count").textContent =
            data.projects;

    } catch (error) {

        console.error(error);

        document.getElementById("developer-count").textContent = "—";
        document.getElementById("skill-count").textContent = "—";
        document.getElementById("technology-count").textContent = "—";
        document.getElementById("project-count").textContent = "—";
    }
}

async function loadDevelopers() {
    const loading = document.getElementById("developers-loading");
    const empty = document.getElementById("developers-empty");
    const error = document.getElementById("developer-error");
    const grid = document.getElementById("developers-grid");
    const search = document.getElementById("developer-search");

    try {
        const response = await fetch("/api/developers");

        if (!response.ok) {
            throw new Error("Failed to load developers");
        }

        const developers = await response.json();

        loading.hidden = true;

        if (developers.length === 0) {
            empty.hidden = false;
            return;
        }

        function renderDevelopers(items) {
            grid.innerHTML = "";

            if (items.length === 0) {
                empty.hidden = false;
                return;
            }

            empty.hidden = true;

            items.forEach((developer) => {

                const card = document.createElement("article");

                card.className = "developer-card";

                card.innerHTML = `
                    <div class="developer-avatar">
                        ${developer.name.charAt(0).toUpperCase()}
                    </div>

                    <div class="developer-info">

                        <h3>
                            ${developer.name}
                        </h3>

                        <p class="developer-role">
                            ${developer.role}
                        </p>

                        <p class="developer-experience">
                            ${developer.experience}
                        </p>

                    </div>

                    <a
                        class="card-link"
                        href="/developers/${encodeURIComponent(developer.name)}"
                    >
                        View profile →
                    </a>
                `;

                grid.appendChild(card);
            });
        }

        renderDevelopers(developers);

        search.addEventListener("input", () => {

            const searchTerm =
                search.value.toLowerCase().trim();

            const filtered = developers.filter(
                (developer) =>
                    developer.name
                        .toLowerCase()
                        .includes(searchTerm)
                    ||
                    developer.role
                        .toLowerCase()
                        .includes(searchTerm)
            );

            renderDevelopers(filtered);
        });

    } catch (err) {

        console.error(err);

        loading.hidden = true;
        error.hidden = false;
    }
}

async function loadDeveloperProfile() {

    const loading =
        document.getElementById("developer-loading");

    const error =
        document.getElementById("developer-error");

    const profile =
        document.getElementById("developer-profile");


    try {

        const pathParts =
            window.location.pathname.split("/");

        const developerName =
            decodeURIComponent(
                pathParts[pathParts.length - 1]
            );


        if (!developerName) {
            throw new Error("Developer name missing");
        }


        const response = await fetch(
            `/api/developers/${encodeURIComponent(developerName)}`
        );


        if (!response.ok) {

            if (response.status === 404) {
                throw new Error("Developer not found");
            }

            throw new Error(
                "Failed to load developer"
            );
        }


        const developer =
            await response.json();


        loading.hidden = true;
        profile.hidden = false;


        /*
         * Basic information
         */

        document.getElementById(
            "profile-name"
        ).textContent = developer.name;


        document.getElementById(
            "profile-role"
        ).textContent = developer.role;


        document.getElementById(
            "profile-experience"
        ).textContent = developer.experience;


        document.getElementById(
            "profile-avatar"
        ).textContent =
            developer.name
                .charAt(0)
                .toUpperCase();


        document.getElementById(
            "connection-developer"
        ).textContent = developer.name;


        /*
         * Skills
         */

        const skillsContainer =
            document.getElementById(
                "profile-skills"
            );


        skillsContainer.innerHTML = "";


        const skills =
            (developer.skills || [])
                .filter(Boolean)
                .sort();


        if (skills.length === 0) {

            skillsContainer.innerHTML = `
                <div class="empty-state">
                    No skills found.
                </div>
            `;

        } else {

            skills.forEach((skill) => {

                const tag =
                    document.createElement("span");

                tag.className = "skill-tag";

                tag.textContent = skill;

                skillsContainer.appendChild(tag);

            });

        }


        /*
         * Projects
         */

        const projectsContainer =
            document.getElementById(
                "profile-projects"
            );


        projectsContainer.innerHTML = "";


        const projects =
            (developer.projects || [])
                .filter(
                    (project) =>
                        project &&
                        project.name
                );


        if (projects.length === 0) {

            projectsContainer.innerHTML = `
                <div class="empty-state">
                    No projects found.
                </div>
            `;

        } else {

            projects.forEach((project) => {

                const card =
                    document.createElement("article");

                card.className =
                    "project-card";


                card.innerHTML = `

                    <h3>
                        ${project.name}
                    </h3>

                    <p>
                        ${
                            project.description ||
                            "No description available."
                        }
                    </p>

                `;


                projectsContainer.appendChild(card);

            });

        }


    } catch (err) {

        console.error(err);

        loading.hidden = true;

        error.hidden = false;

    }

}

async function loadSkillDetail() {

    const loading =
        document.getElementById("skill-loading");

    const error =
        document.getElementById("skill-error");

    const detail =
        document.getElementById("skill-detail");

    try {

        const parts =
            window.location.pathname.split("/");

        const skillName =
            decodeURIComponent(
                parts[parts.length - 1]
            );

        const response =
            await fetch(
                `/api/skills/${encodeURIComponent(skillName)}`
            );

        if (!response.ok) {
            throw new Error(
                `HTTP ${response.status}`
            );
        }

        const skill =
            await response.json();

        console.log("Skill loaded:", skill);

        document.getElementById(
            "skill-name"
        ).textContent = skill.name;

        document.getElementById(
            "skill-avatar"
        ).textContent =
            skill.name.charAt(0).toUpperCase();

        document.getElementById(
            "graph-skill"
        ).textContent = skill.name;


        // Developers

        const developers =
            document.getElementById(
                "skill-developers"
            );

        developers.innerHTML = "";

        (skill.developers || []).forEach(
            (developer) => {

                const link =
                    document.createElement("a");

                link.className =
                    "connection-item";

                link.href =
                    `/developers/${encodeURIComponent(developer)}`;

                link.textContent =
                    `${developer} →`;

                developers.appendChild(link);
            }
        );


        // Projects

        const projects =
            document.getElementById(
                "skill-projects"
            );

        projects.innerHTML = "";

        (skill.projects || []).forEach(
            (project) => {

                const card =
                    document.createElement("article");

                card.className =
                    "project-card";

                card.innerHTML = `
                    <h3>${project}</h3>
                    <p>
                        Connected through the
                        developer knowledge graph.
                    </p>
                `;

                projects.appendChild(card);
            }
        );


        // Related skills

        const related =
            document.getElementById(
                "related-skills"
            );

        related.innerHTML = "";

        (skill.related_skills || []).forEach(
            (name) => {

                const link =
                    document.createElement("a");

                link.className =
                    "skill-tag";

                link.href =
                    `/skills/${encodeURIComponent(name)}`;

                link.textContent = name;

                related.appendChild(link);
            }
        );


        // Next skills

        const next =
            document.getElementById(
                "next-skills"
            );

        if (next) {

            next.innerHTML = "";

            (skill.next_skills || []).forEach(
                (name) => {

                    const link =
                        document.createElement("a");

                    link.className =
                        "skill-tag";

                    link.href =
                        `/skills/${encodeURIComponent(name)}`;

                    link.textContent = name;

                    next.appendChild(link);
                }
            );
        }


        loading.hidden = true;

        detail.hidden = false;


    } catch (err) {

        console.error(
            "Skill detail failed:",
            err
        );

        loading.hidden = true;

        error.hidden = false;
    }
}
async function loadSkills() {

    const loading =
        document.getElementById("skills-loading");

    const empty =
        document.getElementById("skills-empty");

    const error =
        document.getElementById("skills-error");

    const grid =
        document.getElementById("skills-grid");

    const search =
        document.getElementById("skill-search");


    try {

        const response =
            await fetch("/api/skills");


        if (!response.ok) {

            throw new Error(
                `Failed to load skills: HTTP ${response.status}`
            );

        }


        const skills =
            await response.json();


        console.log("Skills loaded:", skills);


        loading.hidden = true;


        function renderSkills(items) {

            grid.innerHTML = "";


            if (items.length === 0) {

                empty.hidden = false;

                return;
            }


            empty.hidden = true;


            items.forEach((skill) => {

                const card =
                    document.createElement("article");


                card.className =
                    "skill-card";


                card.innerHTML = `

                    <div class="skill-card-content">

                        <div class="skill-avatar">
                            ${skill.name
                                .charAt(0)
                                .toUpperCase()}
                        </div>

                        <div>

                            <h3>
                                ${skill.name}
                            </h3>

                            <p>
                                Explore developers,
                                projects and connections.
                            </p>

                        </div>

                    </div>


                    <a
                        class="card-link"
                        href="/skills/${encodeURIComponent(skill.name)}"
                    >
                        Explore skill →
                    </a>

                `;


                grid.appendChild(card);

            });

        }


        if (!skills || skills.length === 0) {

            empty.hidden = false;

            return;

        }


        renderSkills(skills);


        search.addEventListener("input", () => {

            const searchTerm =
                search.value
                    .toLowerCase()
                    .trim();


            const filtered =
                skills.filter((skill) =>
                    skill.name
                        .toLowerCase()
                        .includes(searchTerm)
                );


            renderSkills(filtered);

        });


    } catch (err) {

        console.error(
            "Skills loading failed:",
            err
        );


        loading.hidden = true;

        error.hidden = false;

    }

}

async function loadLearningPath() {

    const startInput = document.getElementById("path-start");
    const targetInput = document.getElementById("path-target");
    const button = document.getElementById("find-path");

    const loading = document.getElementById("path-loading");
    const error = document.getElementById("path-error");
    const empty = document.getElementById("path-empty");
    const results = document.getElementById("path-results");
    const list = document.getElementById("path-list");


    if (!startInput || !targetInput || !button) {
        console.error("Learning path elements not found");
        return;
    }


    button.addEventListener("click", async function () {

        const start = startInput.value.trim();
        const target = targetInput.value.trim();


        console.log("Starting skill:", start);
        console.log("Target skill:", target);


        loading.hidden = true;
        error.hidden = true;
        empty.hidden = true;
        results.hidden = true;


        if (!start || !target) {

            error.textContent =
                "Please enter both a starting skill and a target skill.";

            error.hidden = false;

            return;
        }


        if (start.toLowerCase() === target.toLowerCase()) {

            error.textContent =
                "Starting and target skills must be different.";

            error.hidden = false;

            return;
        }


        loading.hidden = false;
        button.disabled = true;


        try {

            const url =
                `/api/learning-path?start=${encodeURIComponent(start)}&target=${encodeURIComponent(target)}`;


            console.log("Request URL:", url);


            const response = await fetch(url);


            console.log("Response status:", response.status);


            if (!response.ok) {
                throw new Error(
                    `Request failed with status ${response.status}`
                );
            }


            const data = await response.json();


            console.log("API response:", data);


            loading.hidden = true;


            if (!Array.isArray(data.paths) || data.paths.length === 0) {

                empty.hidden = false;

                return;
            }


            list.innerHTML = "";


            data.paths.forEach(function (path, index) {

                const card =
                    document.createElement("article");

                card.className = "path-card";


                const header =
                    document.createElement("div");

                header.className =
                    "path-card-header";


                header.innerHTML = `
                    <span>Path ${index + 1}</span>
                    <strong>
                        ${path.hops}
                        ${path.hops === 1 ? "hop" : "hops"}
                    </strong>
                `;


                const chain =
                    document.createElement("div");

                chain.className =
                    "path-chain";


                path.skills.forEach(function (skill, skillIndex) {

                    const skillElement =
                        document.createElement("span");

                    skillElement.className =
                        "path-skill";

                    skillElement.textContent =
                        skill;


                    chain.appendChild(skillElement);


                    if (skillIndex < path.skills.length - 1) {

                        const arrow =
                            document.createElement("span");

                        arrow.className =
                            "path-arrow";

                        arrow.textContent =
                            "→";

                        chain.appendChild(arrow);
                    }

                });


                card.appendChild(header);
                card.appendChild(chain);

                list.appendChild(card);

            });


            results.hidden = false;


        } catch (err) {

            console.error(
                "Learning path request failed:",
                err
            );


            loading.hidden = true;


            error.textContent =
                "Unable to find a learning path. Please try again.";

            error.hidden = false;


        } finally {

            button.disabled = false;

        }

    });

}