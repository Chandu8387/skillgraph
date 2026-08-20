import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getProjects } from "../services/api";


function Projects() {

    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);


    useEffect(() => {

        getProjects()
            .then(setProjects)
            .catch(error => {
                console.error("Projects error:", error);
                setError("Unable to load projects.");
            })
            .finally(() => {
                setLoading(false);
            });

    }, []);


    if (loading) {
        return <p>Loading projects...</p>;
    }


    if (error) {
        return <p>{error}</p>;
    }


    return (
        <section>

            <header className="page-header">

                <span className="eyebrow">
                    PROJECT EXPLORER
                </span>

                <h1>
                    Projects
                </h1>

                <p>
                    Explore projects and the skills,
                    technologies and developers connected
                    to them.
                </p>

            </header>


            {projects.length === 0 ? (

                <p>No projects found.</p>

            ) : (

                <div className="project-grid">

                    {projects.map(project => (

                        <Link
                            key={project.name}
                            to={`/projects/${encodeURIComponent(project.name)}`}
                            className="project-card"
                        >

                            <h2>
                                {project.name}
                            </h2>

                            <p>
                                {project.description}
                            </p>

                            <span>
                                Explore project →
                            </span>

                        </Link>

                    ))}

                </div>

            )}

        </section>
    );
}


export default Projects;