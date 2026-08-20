import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getSkill } from "../services/api";


function SkillDetail() {

    const { name } = useParams();

    const [skill, setSkill] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");


    useEffect(() => {

        async function loadSkill() {

            try {

                setLoading(true);
                setError("");

                console.log("Loading skill:", name);

                const data = await getSkill(name);

                console.log(
                    "Skill API response:",
                    data
                );

                /*
                 * Normalize API response.
                 *
                 * This protects the UI if the backend
                 * returns missing arrays.
                 */

                const normalizedSkill = {

                    name:
                        data?.name ??
                        name,

                    developers:
                        Array.isArray(data?.developers)
                            ? data.developers
                            : [],

                    projects:
                        Array.isArray(data?.projects)
                            ? data.projects
                            : [],

                    related_skills:
                        Array.isArray(data?.related_skills)
                            ? data.related_skills
                            : [],

                    next_skills:
                        Array.isArray(data?.next_skills)
                            ? data.next_skills
                            : [],

                };


                console.log(
                    "Normalized skill:",
                    normalizedSkill
                );


                setSkill(normalizedSkill);

            }
            catch (err) {

                console.error(
                    "Failed to load skill:",
                    err
                );

                setError(
                    err.message ||
                    "Unable to load this skill."
                );

            }
            finally {

                setLoading(false);

            }

        }


        if (name) {

            loadSkill();

        }
        else {

            setLoading(false);

            setError(
                "Skill name is missing."
            );

        }

    }, [name]);


    /* =========================
       LOADING
    ========================= */

    if (loading) {

        return (
            <main className="skill-page">

                <div className="skill-container">

                    <div className="loading-state">

                        Loading skill...

                    </div>

                </div>

            </main>
        );

    }


    /* =========================
       ERROR
    ========================= */

    if (error) {

        return (
            <main className="skill-page">

                <div className="skill-container">

                    <div className="error-state">

                        <strong>
                            Unable to load skill
                        </strong>

                        <p>
                            {error}
                        </p>

                    </div>

                </div>

            </main>
        );

    }


    /* =========================
       NO DATA
    ========================= */

    if (!skill) {

        return (
            <main className="skill-page">

                <div className="skill-container">

                    <div className="empty-row">

                        Skill not found.

                    </div>

                </div>

            </main>
        );

    }


    return (

        <main className="skill-page">

            <div className="skill-container">


                {/* =========================
                    HEADER
                ========================= */}

                <header className="skill-header">

                    <span className="skill-eyebrow">
                        SKILL EXPLORER
                    </span>

                    <h1>
                        {skill.name}
                    </h1>

                    <p>
                        Explore the graph connections
                        around this skill.
                    </p>

                </header>


                <div className="skill-content">


                    {/* =========================
                        DEVELOPERS
                    ========================= */}

                    <section className="skill-section">

                        <div className="section-title">

                            <span className="section-index">
                                01
                            </span>

                            <div>

                                <h2>
                                    Developers
                                </h2>

                                <p>
                                    Developers connected
                                    to this skill.
                                </p>

                            </div>

                        </div>


                        <div className="entity-list">

                            {skill.developers.length > 0 ? (

                                skill.developers.map(
                                    (developer, index) => {

                                        const developerName =
                                            typeof developer === "string"
                                                ? developer
                                                : developer.name;

                                        const developerRole =
                                            typeof developer === "object"
                                                ? developer.role
                                                : null;


                                        return (

                                            <Link
                                                key={
                                                    developerName ||
                                                    index
                                                }
                                                to={`/developers/${encodeURIComponent(
                                                    developerName
                                                )}`}
                                                className="entity-row"
                                            >

                                                <div>

                                                    <strong>
                                                        {developerName}
                                                    </strong>

                                                    {developerRole && (

                                                        <span>
                                                            {developerRole}
                                                        </span>

                                                    )}

                                                </div>

                                                <span className="entity-arrow">
                                                    →
                                                </span>

                                            </Link>

                                        );

                                    }
                                )

                            ) : (

                                <div className="empty-row">
                                    No developers found.
                                </div>

                            )}

                        </div>

                    </section>


                    {/* =========================
                        PROJECTS
                    ========================= */}

                    <section className="skill-section">

                        <div className="section-title">

                            <span className="section-index">
                                02
                            </span>

                            <div>

                                <h2>
                                    Projects
                                </h2>

                                <p>
                                    Projects using this skill.
                                </p>

                            </div>

                        </div>


                        <div className="entity-list">

                            {skill.projects.length > 0 ? (

                                skill.projects.map(
                                    (project, index) => {

                                        const projectName =
                                            typeof project === "string"
                                                ? project
                                                : project.name;

                                        const description =
                                            typeof project === "object"
                                                ? project.description
                                                : null;


                                        return (

                                            <Link
                                                key={
                                                    projectName ||
                                                    index
                                                }
                                                to={`/projects/${encodeURIComponent(
                                                    projectName
                                                )}`}
                                                className="entity-row"
                                            >

                                                <div>

                                                    <strong>
                                                        {projectName}
                                                    </strong>

                                                    {description && (

                                                        <span>
                                                            {description}
                                                        </span>

                                                    )}

                                                </div>

                                                <span className="entity-arrow">
                                                    →
                                                </span>

                                            </Link>

                                        );

                                    }
                                )

                            ) : (

                                <div className="empty-row">
                                    No projects found.
                                </div>

                            )}

                        </div>

                    </section>


                    {/* =========================
                        RELATED SKILLS
                    ========================= */}

                    <section className="skill-section">

                        <div className="section-title">

                            <span className="section-index">
                                03
                            </span>

                            <div>

                                <h2>
                                    Related Skills
                                </h2>

                                <p>
                                    Skills connected
                                    to this skill.
                                </p>

                            </div>

                        </div>


                        <div className="skill-grid">

                            {skill.related_skills.length > 0 ? (

                                skill.related_skills.map(
                                    (related, index) => {

                                        const relatedName =
                                            typeof related === "string"
                                                ? related
                                                : related.name;


                                        return (

                                            <Link
                                                key={
                                                    relatedName ||
                                                    index
                                                }
                                                to={`/skills/${encodeURIComponent(
                                                    relatedName
                                                )}`}
                                                className="skill-card"
                                            >

                                                <strong>
                                                    {relatedName}
                                                </strong>

                                                <span>
                                                    Explore connection →
                                                </span>

                                            </Link>

                                        );

                                    }
                                )

                            ) : (

                                <div className="empty-row">
                                    No related skills found.
                                </div>

                            )}

                        </div>

                    </section>


                    {/* =========================
                        NEXT SKILLS
                    ========================= */}

                    <section className="skill-section">

                        <div className="section-title">

                            <span className="section-index">
                                04
                            </span>

                            <div>

                                <h2>
                                    Next Skills
                                </h2>

                                <p>
                                    Skills you can learn next.
                                </p>

                            </div>

                        </div>


                        <div className="skill-grid">

                            {skill.next_skills.length > 0 ? (

                                skill.next_skills.map(
                                    (next, index) => {

                                        const nextName =
                                            typeof next === "string"
                                                ? next
                                                : next.name;


                                        return (

                                            <Link
                                                key={
                                                    nextName ||
                                                    index
                                                }
                                                to={`/skills/${encodeURIComponent(
                                                    nextName
                                                )}`}
                                                className="skill-card"
                                            >

                                                <strong>
                                                    {nextName}
                                                </strong>

                                                <span>
                                                    View skill →
                                                </span>

                                            </Link>

                                        );

                                    }
                                )

                            ) : (

                                <div className="empty-row">
                                    No next skills found.
                                </div>

                            )}

                        </div>

                    </section>

                </div>

            </div>

        </main>

    );

}


export default SkillDetail;