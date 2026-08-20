import { useState } from "react";
import { findLearningPath } from "../services/api";

function LearningPath() {
  const [start, setStart] = useState("");
  const [target, setTarget] = useState("");

  const [paths, setPaths] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [searched, setSearched] = useState(false);

  async function handleFindPath() {
    if (!start.trim() || !target.trim()) {
      setError("Please enter both starting and target skills.");
      return;
    }

    if (start.trim().toLowerCase() === target.trim().toLowerCase()) {
      setError("Starting and target skills must be different.");
      return;
    }

    setLoading(true);
    setError("");
    setPaths([]);
    setSearched(true);

    try {
      const data = await findLearningPath(
        start.trim(),
        target.trim()
      );

      setPaths(data.paths || []);
    } catch (err) {
      console.error(err);
      setError("Unable to find a learning path.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="learning-path-page">

      {/* Header */}

      <section className="page-header">
        <span className="eyebrow">
          GRAPH LEARNING PATH
        </span>

        <h1>
          Learning Path
        </h1>

        <p>
          Discover paths between connected skills.
        </p>
      </section>


      {/* Search form */}

      <section className="path-form">

        <div className="form-group">

          <label htmlFor="path-start">
            Starting skill
          </label>

          <input
            id="path-start"
            className="search-input"
            type="text"
            value={start}
            onChange={(e) => setStart(e.target.value)}
            placeholder="e.g. Python"
          />

        </div>


        <div className="form-group">

          <label htmlFor="path-target">
            Target skill
          </label>

          <input
            id="path-target"
            className="search-input"
            type="text"
            value={target}
            onChange={(e) => setTarget(e.target.value)}
            placeholder="e.g. Django"
          />

        </div>


        <button
          className="primary-button"
          type="button"
          onClick={handleFindPath}
          disabled={loading}
        >
          {loading ? "Finding..." : "Find Learning Path"}
        </button>

      </section>


      {/* Loading */}

      {loading && (
        <div className="loading-state">
          Finding the best paths...
        </div>
      )}


      {/* Error */}

      {error && !loading && (
        <div className="error-state">
          {error}
        </div>
      )}


      {/* No results */}

      {!loading &&
        searched &&
        !error &&
        paths.length === 0 && (
          <div className="empty-state">
            No learning path found between these skills.
          </div>
        )}


      {/* Results */}

      {!loading && paths.length > 0 && (
        <section className="path-results">

          <div className="section-heading">

            <span className="eyebrow">
              GRAPH TRAVERSAL
            </span>

            <h2>
              Suggested paths
            </h2>

            <p>
              The knowledge graph found these connected
              learning paths.
            </p>

          </div>


          <div className="path-list">

            {paths.map((path, index) => (

              <div
                className="path-card"
                key={index}
              >

                <div className="path-card-header">

                  <div>
                    <span className="path-label">
                      Path {index + 1}
                    </span>

                    <h3>
                      {path.hops}{" "}
                      {path.hops === 1 ? "hop" : "hops"}
                    </h3>
                  </div>

                </div>


                <div className="path-flow">

                  {path.skills.map((skill, skillIndex) => (

                    <div
                      className="path-step"
                      key={skillIndex}
                    >

                      <div className="path-node">
                        {skill}
                      </div>

                      {skillIndex <
                        path.skills.length - 1 && (
                        <div className="path-arrow">
                          →
                        </div>
                      )}

                    </div>

                  ))}

                </div>

              </div>

            ))}

          </div>

        </section>
      )}

    </div>
  );
}

export default LearningPath;