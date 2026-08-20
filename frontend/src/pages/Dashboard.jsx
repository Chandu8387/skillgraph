import { useEffect, useState } from "react";
import { getStats } from "../services/api";

function Dashboard() {
    const [stats, setStats] = useState({
        developers: 0,
        skills: 0,
        projects: 0,
        technologies: 0,
    });

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    useEffect(() => {
        async function loadDashboard() {
            try {
                const data = await getStats();

                setStats({
                    developers: data.developers ?? 0,
                    skills: data.skills ?? 0,
                    projects: data.projects ?? 0,
                    technologies: data.technologies ?? 0,
                });
            } catch (err) {
                console.error("Failed to load dashboard:", err);
                setError(true);
            } finally {
                setLoading(false);
            }
        }

        loadDashboard();
    }, []);

    return (
        <main className="page">

            <div className="container">

                {/* =========================
                    HERO
                ========================= */}

                <section className="dashboard-hero">

                    <span className="eyebrow">
                        KNOWLEDGE GRAPH
                    </span>

                    <h1>
                        SkillGraph
                    </h1>

                    <p>
                        Explore the relationships between
                        developers, skills and projects.
                    </p>

                </section>


                {/* =========================
                    LOADING
                ========================= */}

                {loading && (
                    <div className="loading-state">
                        Loading dashboard...
                    </div>
                )}


                {/* =========================
                    ERROR
                ========================= */}

                {!loading && error && (
                    <div className="error-state">
                        Unable to load dashboard statistics.
                    </div>
                )}


                {/* =========================
                    STATISTICS
                ========================= */}

                {!loading && !error && (
                    <section className="stats-grid">

                        <div className="stats-card">
                            <strong>
                                {stats.developers}
                            </strong>

                            <span>
                                Developers
                            </span>
                        </div>


                        <div className="stats-card">
                            <strong>
                                {stats.skills}
                            </strong>

                            <span>
                                Skills
                            </span>
                        </div>


                        <div className="stats-card">
                            <strong>
                                {stats.projects}
                            </strong>

                            <span>
                                Projects
                            </span>
                        </div>


                        <div className="stats-card">
                            <strong>
                                {stats.technologies}
                            </strong>

                            <span>
                                Technologies
                            </span>
                        </div>

                    </section>
                )}

            </div>

        </main>
    );
}

export default Dashboard;