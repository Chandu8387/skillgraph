import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getSkills } from "../services/api";


function Skills() {

    const [skills, setSkills] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [search, setSearch] = useState("");


    useEffect(() => {

        getSkills()
            .then(data => {
                setSkills(data);
            })
            .catch(error => {
                console.error("Skills error:", error);
                setError("Unable to load skills.");
            })
            .finally(() => {
                setLoading(false);
            });

    }, []);


    const filteredSkills = skills.filter(skill =>
        skill.name
            .toLowerCase()
            .includes(search.toLowerCase())
    );


    if (loading) {
        return (
            <section>
                <h1>Skills</h1>
                <p>Loading skills...</p>
            </section>
        );
    }


    if (error) {
        return (
            <section>
                <h1>Skills</h1>
                <p>{error}</p>
            </section>
        );
    }


    return (
        <section>

            <header className="page-header">

                <span className="eyebrow">
                    SKILL EXPLORER
                </span>

                <h1>
                    Skills
                </h1>

                <p>
                    Explore skills and discover the
                    developers, projects and technologies
                    connected to them.
                </p>

            </header>


            <div className="search-section">

                <input
                    className="search-input"
                    type="search"
                    placeholder="Search skills..."
                    value={search}
                    onChange={event =>
                        setSearch(event.target.value)
                    }
                />

            </div>


            {filteredSkills.length === 0 ? (

                <p>
                    No skills found.
                </p>

            ) : (

                <div className="skill-grid">

                    {filteredSkills.map(skill => (

                        <Link
                            key={skill.name}
                            to={`/skills/${encodeURIComponent(skill.name)}`}
                            className="skill-card"
                        >

                            <h2>
                                {skill.name}
                            </h2>

                            <span>
                                Explore connections →
                            </span>

                        </Link>

                    ))}

                </div>

            )}

        </section>
    );
}


export default Skills;