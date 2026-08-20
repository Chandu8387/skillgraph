import {
    useEffect,
    useState
} from "react";

import {
    Link
} from "react-router-dom";

import {
    getDevelopers
} from "../services/api";

import AddDeveloperModal
    from "../components/AddDeveloperModal";


function Developers() {

    const [
        developers,
        setDevelopers
    ] = useState([]);

    const [
        loading,
        setLoading
    ] = useState(true);

    const [
        error,
        setError
    ] = useState("");

    const [
        showAddDeveloper,
        setShowAddDeveloper
    ] = useState(false);


    async function loadDevelopers() {

        try {

            setLoading(true);
            setError("");

            const data =
                await getDevelopers();

            console.log(
                "GET developers:",
                data
            );

            if (Array.isArray(data)) {

                setDevelopers(data);

            } else {

                console.error(
                    "Unexpected API response:",
                    data
                );

                setDevelopers([]);
            }

        } catch (err) {

            console.error(
                "Failed to load developers:",
                err
            );

            setError(
                "Unable to load developers."
            );

        } finally {

            setLoading(false);
        }
    }


    useEffect(() => {

        loadDevelopers();

    }, []);


    async function handleDeveloperCreated(
        developer
    ) {

        console.log(
            "Developer created:",
            developer
        );


        // IMPORTANT:
        // Read the database again.

        await loadDevelopers();

        setShowAddDeveloper(
            false
        );
    }


    return (

        <section className="developers-page">

            <header className="developers-header">

                <div>

                    <span className="eyebrow">
                        PEOPLE & EXPERTISE
                    </span>

                    <h1>
                        Developers
                    </h1>

                    <p>
                        Explore developers, their skills
                        and the projects they work on.
                    </p>

                </div>


                <button
                    type="button"
                    className="add-developer-button"
                    onClick={() =>
                        setShowAddDeveloper(true)
                    }
                >

                    <span>
                        +
                    </span>

                    Add Developer

                </button>

            </header>


            {error && (

                <div className="error-state">
                    {error}
                </div>

            )}


            {loading ? (

                <div className="loading-state">
                    Loading developers...
                </div>

            ) : (

                developers.length === 0 ? (

                    <div className="empty-state">

                        <h3>
                            No developers found
                        </h3>

                        <p>
                            Add your first developer
                            to the knowledge graph.
                        </p>

                    </div>

                ) : (

                    <div className="developer-grid">

                        {developers.map(
                            developer => (

                                <Link
                                    key={
                                        developer.name
                                    }
                                    to={
                                        `/developers/${encodeURIComponent(
                                            developer.name
                                        )}`
                                    }
                                    className="developer-card"
                                >

                                    <div className="developer-avatar">

                                        {developer.name
                                            ?.charAt(0)
                                            ?.toUpperCase()}

                                    </div>


                                    <div className="developer-info">

                                        <h3>
                                            {
                                                developer.name
                                            }
                                        </h3>

                                        <p>
                                            {
                                                developer.role ||
                                                "Developer"
                                            }
                                        </p>

                                        <p>
                                            {
                                                developer.experience ||
                                                ""
                                            }
                                        </p>

                                    </div>


                                    <span className="developer-arrow">
                                        →
                                    </span>

                                </Link>
                            )
                        )}

                    </div>
                )
            )}


            {showAddDeveloper && (

                <AddDeveloperModal

                    onClose={() =>
                        setShowAddDeveloper(false)
                    }

                    onCreated={
                        handleDeveloperCreated
                    }

                />

            )}

        </section>
    );
}


export default Developers;