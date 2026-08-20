import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getDeveloper } from "../services/api";

function DeveloperDetail() {
    const { name } = useParams();

    const [developer, setDeveloper] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        async function loadDeveloper() {
            try {
                setLoading(true);
                setError("");

                const data = await getDeveloper(name);

                console.log("Developer API response:", data);

                setDeveloper(data);
            } catch (err) {
                console.error("Failed to load developer:", err);
                setError("Unable to load this developer.");
            } finally {
                setLoading(false);
            }
        }

        if (name) {
            loadDeveloper();
        } else {
            setLoading(false);
            setError("Developer name is missing.");
        }
    }, [name]);

    if (loading) {
        return (
            <main className="developer-page">
                <div className="developer-container">
                    <div className="state-box">
                        Loading developer...
                    </div>
                </div>
            </main>
        );
    }

    if (error) {
        return (
            <main className="developer-page">
                <div className="developer-container">
                    <div className="state-box error">
                        {error}
                    </div>
                </div>
            </main>
        );
    }

    if (!developer) {
        return (
            <main className="developer-page">
                <div className="developer-container">
                    <div className="state-box">
                        Developer not found.
                    </div>
                </div>
            </main>
        );
    }

    const skills = developer.skills || [];
    const projects = developer.projects || [];

    return (
        <main className="developer-page">

            <div className="developer-container">

                {/* Back */}
                <Link to="/developers" className="back-link">
                    <span>←</span>
                    Back to developers
                </Link>


                {/* =========================
                    PROFILE HERO
                ========================= */}

                <section className="profile-card">

                    <div className="profile-avatar">
                        {developer.name?.charAt(0).toUpperCase()}
                    </div>

                    <div className="profile-content">

                        <span className="profile-eyebrow">
                            DEVELOPER PROFILE
                        </span>

                        <h1>
                            {developer.name}
                        </h1>

                        <p className="profile-role">
                            {developer.role || "Developer"}
                        </p>

                        <div className="connection-badge">

                            <span className="connection-icon">
                                ♧
                            </span>

                            <strong>
                                {developer.connections ??
                                    developer.skills?.length ??
                                    0}
                            </strong>

                            <span>
                                Connections
                            </span>

                        </div>

                    </div>

                </section>


                {/* =========================
                    SKILLS
                ========================= */}

                <section className="detail-card">

                    <div className="card-heading">

                        <div className="heading-icon">
                            &lt;/&gt;
                        </div>

                        <h2>
                            Skills
                        </h2>

                    </div>

                    {skills.length > 0 ? (

                        <div className="skills-list">

                            {skills.map((skill) => {

                                const skillName =
                                    typeof skill === "string"
                                        ? skill
                                        : skill.name;

                                return (
                                    <Link
                                        key={skillName}
                                        to={`/skills/${encodeURIComponent(
                                            skillName
                                        )}`}
                                        className="skill-chip"
                                    >
                                        {skillName}
                                    </Link>
                                );
                            })}

                        </div>

                    ) : (

                        <div className="empty-content">
                            No skills found.
                        </div>

                    )}

                </section>


                {/* =========================
                    PROJECTS
                ========================= */}

                <section className="detail-card">

                    <div className="card-heading">

                        <div className="heading-icon">
                            □
                        </div>

                        <h2>
                            Projects
                        </h2>

                    </div>

                    {projects.length > 0 ? (

                        <div className="projects-list">

                            {projects.map((project) => {

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
                                        key={projectName}
                                        to={`/projects/${encodeURIComponent(
                                            projectName
                                        )}`}
                                        className="project-row"
                                    >

                                        <div className="project-accent" />

                                        <div className="project-info">

                                            <h3>
                                                {projectName}
                                            </h3>

                                            {description && (
                                                <p>
                                                    {description}
                                                </p>
                                            )}

                                        </div>

                                        <span className="project-arrow">
                                            →
                                        </span>

                                    </Link>
                                );
                            })}

                        </div>

                    ) : (

                        <div className="empty-content">
                            No projects found.
                        </div>

                    )}

                </section>


                {/* =========================
                    ABOUT
                ========================= */}

                <section className="detail-card">

                    <div className="card-heading">

                        <div className="heading-icon">
                            ♙
                        </div>

                        <h2>
                            About
                        </h2>

                    </div>

                    <div className="about-grid">

                        <div className="about-item">
                            <span>Role</span>
                            <strong>
                                {developer.role || "Developer"}
                            </strong>
                        </div>

                        <div className="about-item">
                            <span>Connections</span>
                            <strong>
                                {developer.connections ??
                                    skills.length}
                            </strong>
                        </div>

                        <div className="about-item">
                            <span>Focused On</span>
                            <strong>
                                Web Development
                            </strong>
                        </div>

                        <div className="about-item">
                            <span>Skills</span>
                            <strong>
                                {skills.length}
                            </strong>
                        </div>

                    </div>

                </section>

            </div>

        </main>
    );
}

export default DeveloperDetail;