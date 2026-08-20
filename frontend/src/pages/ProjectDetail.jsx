import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getProject } from "../services/api";

function ProjectDetail() {
    const { name } = useParams();

    const [project, setProject] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        getProject(name)
            .then(setProject)
            .catch(error => {
                console.error("Project detail error:", error);
                setError("Unable to load project.");
            })
            .finally(() => {
                setLoading(false);
            });
    }, [name]);

    if (loading) {
        return <p>Loading project...</p>;
    }

    if (error) {
        return <p>{error}</p>;
    }

    if (!project) {
        return <p>Project not found.</p>;
    }

    return (
        <section>

            <Link to="/projects">
                ← Back to projects
            </Link>

            <header className="page-header">

                <span className="eyebrow">
                    PROJECT EXPLORER
                </span>

                <h1>
                    {project.name}
                </h1>

                <p>
                    {project.description}
                </p>

            </header>


            <section className="profile-section">

                <h2>
                    Technologies
                </h2>

                {project.technologies?.length ? (
                    <div className="tag-list">
                        {project.technologies.map(technology => (
                            <span
                                className="tag"
                                key={technology}
                            >
                                {technology}
                            </span>
                        ))}
                    </div>
                ) : (
                    <p>No technologies found.</p>
                )}

            </section>


            <section className="profile-section">

                <h2>
                    Required Skills
                </h2>

                {project.skills?.length ? (
                    <div className="tag-list">

                        {project.skills.map(skill => (
                            <Link
                                className="tag"
                                key={skill}
                                to={`/skills/${encodeURIComponent(skill)}`}
                            >
                                {skill}
                            </Link>
                        ))}

                    </div>
                ) : (
                    <p>No skills found.</p>
                )}

            </section>


            <section className="profile-section">

                <h2>
                    Developers
                </h2>

                {project.developers?.length ? (
                    <div className="connection-list">

                        {project.developers.map(developer => (
                            <Link
                                key={developer}
                                to={`/developers/${encodeURIComponent(developer)}`}
                            >
                                {developer}
                            </Link>
                        ))}

                    </div>
                ) : (
                    <p>No developers found.</p>
                )}

            </section>


            <section className="profile-section">

                <div className="info-panel">

                    <div>

                        <span className="eyebrow">
                            GRAPH CONNECTIONS
                        </span>

                        <h2>
                            Project knowledge graph
                        </h2>

                        <p>
                            This project connects developers,
                            required skills and technologies
                            through graph relationships.
                        </p>

                    </div>

                    <div className="connection-preview">

                        <div className="connection-node">
                            Project
                        </div>

                        <div className="connection-line"></div>

                        <div className="connection-node">
                            Skills
                        </div>

                        <div className="connection-line"></div>

                        <div className="connection-node">
                            Developers
                        </div>

                    </div>

                </div>

            </section>

        </section>
    );
}

export default ProjectDetail;