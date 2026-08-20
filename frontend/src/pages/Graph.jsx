import { useEffect, useMemo, useState } from "react";

import {
    ReactFlow,
    Background,
    Controls,
    MiniMap,
    Handle,
    Position,
    useNodesState,
    useEdgesState,
} from "@xyflow/react";

import "@xyflow/react/dist/style.css";

import {
    getDevelopers,
    getDeveloper,
    getSkills,
    getSkill,
    getProjects,
    getProject,
} from "../services/api";

//import "./Graph.css";


/* =========================================================
   HELPERS
========================================================= */

function getName(value) {
    if (!value) return "";

    if (typeof value === "string") {
        return value;
    }

    return (
        value.name ||
        value.title ||
        value.skill ||
        value.project ||
        ""
    );
}


function getItems(value) {
    if (!Array.isArray(value)) {
        return [];
    }

    return value
        .map(getName)
        .filter(Boolean);
}


function normalize(value) {
    return String(value || "")
        .trim()
        .toLowerCase();
}


/* =========================================================
   CUSTOM GRAPH NODE
========================================================= */

function GraphNode({ data }) {

    return (
        <div
            className={`graph-node graph-node-${data.type}`}
        >

            <Handle
                type="target"
                position={Position.Left}
                className="graph-handle"
            />

            <div className="graph-node-icon">
                {data.type === "developer" && "D"}
                {data.type === "skill" && "S"}
                {data.type === "project" && "P"}
            </div>

            <div className="graph-node-content">

                <strong>
                    {data.label}
                </strong>

                <span>
                    {data.subtitle}
                </span>

            </div>

            <Handle
                type="source"
                position={Position.Right}
                className="graph-handle"
            />

        </div>
    );
}


const nodeTypes = {
    graphNode: GraphNode,
};


/* =========================================================
   GRAPH PAGE
========================================================= */

function Graph() {

    const [developers, setDevelopers] = useState([]);
    const [skills, setSkills] = useState([]);
    const [projects, setProjects] = useState([]);

    const [developerDetails, setDeveloperDetails] = useState({});
    const [skillDetails, setSkillDetails] = useState({});
    const [projectDetails, setProjectDetails] = useState({});

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [selectedNode, setSelectedNode] = useState(null);

    const [search, setSearch] = useState("");

    const [view, setView] = useState("all");


    /* =====================================================
       LOAD DATA
    ===================================================== */

    useEffect(() => {

        async function loadGraph() {

            try {

                setLoading(true);
                setError("");

                const [
                    developersData,
                    skillsData,
                    projectsData,
                ] = await Promise.all([
                    getDevelopers(),
                    getSkills(),
                    getProjects(),
                ]);


                const developerList =
                    Array.isArray(developersData)
                        ? developersData
                        : developersData?.developers || [];


                const skillList =
                    Array.isArray(skillsData)
                        ? skillsData
                        : skillsData?.skills || [];


                const projectList =
                    Array.isArray(projectsData)
                        ? projectsData
                        : projectsData?.projects || [];


                setDevelopers(developerList);
                setSkills(skillList);
                setProjects(projectList);


                /* -----------------------------------------
                   LOAD DETAIL DATA
                ----------------------------------------- */

                const developerResults =
                    await Promise.all(
                        developerList.map(async (developer) => {

                            const name = getName(developer);

                            try {
                                const data =
                                    await getDeveloper(name);

                                return [name, data];

                            } catch {
                                return [name, developer];
                            }
                        })
                    );


                const skillResults =
                    await Promise.all(
                        skillList.map(async (skill) => {

                            const name = getName(skill);

                            try {
                                const data =
                                    await getSkill(name);

                                return [name, data];

                            } catch {
                                return [name, skill];
                            }
                        })
                    );


                const projectResults =
                    await Promise.all(
                        projectList.map(async (project) => {

                            const name = getName(project);

                            try {
                                const data =
                                    await getProject(name);

                                return [name, data];

                            } catch {
                                return [name, project];
                            }
                        })
                    );


                setDeveloperDetails(
                    Object.fromEntries(developerResults)
                );

                setSkillDetails(
                    Object.fromEntries(skillResults)
                );

                setProjectDetails(
                    Object.fromEntries(projectResults)
                );


            } catch (err) {

                console.error(
                    "Graph loading error:",
                    err
                );

                setError(
                    "Unable to load graph data."
                );

            } finally {

                setLoading(false);

            }
        }


        loadGraph();

    }, []);


    /* =====================================================
       CREATE GRAPH
    ===================================================== */

    const graphData = useMemo(() => {

        const nodes = [];
        const edges = [];

        const developerMap = {};
        const skillMap = {};
        const projectMap = {};


        /* -----------------------------------------
           DEVELOPERS
        ----------------------------------------- */

        developers.forEach((developer, index) => {

            const name = getName(developer);

            const id = `developer-${normalize(name)}`;

            developerMap[normalize(name)] = id;

            nodes.push({

                id,

                type: "graphNode",

                position: {
                    x: 40,
                    y: index * 110 + 80,
                },

                data: {

                    label: name,

                    subtitle:
                        developerDetails[name]?.role ||
                        developer.role ||
                        "Developer",

                    type: "developer",

                },

            });

        });


        /* -----------------------------------------
           SKILLS
        ----------------------------------------- */

        skills.forEach((skill, index) => {

            const name = getName(skill);

            const id =
                `skill-${normalize(name)}`;

            skillMap[normalize(name)] = id;

            nodes.push({

                id,

                type: "graphNode",

                position: {
                    x: 390,
                    y: index * 85 + 50,
                },

                data: {

                    label: name,

                    subtitle:
                        skill.level ||
                        skillDetails[name]?.level ||
                        "Skill",

                    type: "skill",

                },

            });

        });


        /* -----------------------------------------
           PROJECTS
        ----------------------------------------- */

        projects.forEach((project, index) => {

            const name = getName(project);

            const id =
                `project-${normalize(name)}`;

            projectMap[normalize(name)] = id;

            nodes.push({

                id,

                type: "graphNode",

                position: {
                    x: 760,
                    y: index * 110 + 80,
                },

                data: {

                    label: name,

                    subtitle:
                        project.type ||
                        projectDetails[name]?.type ||
                        "Project",

                    type: "project",

                },

            });

        });


        /* =================================================
           DEVELOPER → SKILL
        ================================================= */

        Object.entries(developerDetails)
            .forEach(([developerName, developer]) => {

                const developerId =
                    developerMap[
                        normalize(developerName)
                    ];

                if (!developerId) return;


                const developerSkills = getItems(
                    developer.skills
                );


                developerSkills.forEach(skillName => {

                    const skillId =
                        skillMap[
                            normalize(skillName)
                        ];

                    if (!skillId) return;


                    edges.push({

                        id:
                            `edge-${developerId}-${skillId}`,

                        source: developerId,

                        target: skillId,

                        type: "smoothstep",

                        className:
                            "edge-developer",

                    });

                });

            });


        /* =================================================
           DEVELOPER → PROJECT
        ================================================= */

        Object.entries(developerDetails)
            .forEach(([developerName, developer]) => {

                const developerId =
                    developerMap[
                        normalize(developerName)
                    ];

                if (!developerId) return;


                const developerProjects =
                    getItems(developer.projects);


                developerProjects.forEach(projectName => {

                    const projectId =
                        projectMap[
                            normalize(projectName)
                        ];

                    if (!projectId) return;


                    edges.push({

                        id:
                            `edge-${developerId}-${projectId}`,

                        source: developerId,

                        target: projectId,

                        type: "smoothstep",

                        className:
                            "edge-project",

                    });

                });

            });


        /* =================================================
           PROJECT → SKILL
        ================================================= */

        Object.entries(projectDetails)
            .forEach(([projectName, project]) => {

                const projectId =
                    projectMap[
                        normalize(projectName)
                    ];

                if (!projectId) return;


                const projectSkills =
                    getItems(project.skills);


                projectSkills.forEach(skillName => {

                    const skillId =
                        skillMap[
                            normalize(skillName)
                        ];

                    if (!skillId) return;


                    edges.push({

                        id:
                            `edge-${projectId}-${skillId}`,

                        source: projectId,

                        target: skillId,

                        type: "smoothstep",

                        className:
                            "edge-project-skill",

                    });

                });

            });


        return {
            nodes,
            edges,
        };

    }, [
        developers,
        skills,
        projects,
        developerDetails,
        skillDetails,
        projectDetails,
    ]);


    const filteredNodes = useMemo(() => {

        return graphData.nodes.filter(node => {

            const matchesSearch =
                !search ||
                node.data.label
                    .toLowerCase()
                    .includes(search.toLowerCase());


            const matchesView =
                view === "all" ||
                node.data.type === view;


            return (
                matchesSearch &&
                matchesView
            );

        });

    }, [
        graphData.nodes,
        search,
        view,
    ]);


    const visibleNodeIds =
        new Set(
            filteredNodes.map(node => node.id)
        );


    const filteredEdges =
        graphData.edges.filter(edge =>
            visibleNodeIds.has(edge.source) &&
            visibleNodeIds.has(edge.target)
        );


    /* =====================================================
       NODE CLICK
    ===================================================== */

    function handleNodeClick(event, node) {

        event.stopPropagation();

        setSelectedNode(node);

    }


    /* =====================================================
       DETAILS
    ===================================================== */

    function getSelectedDetails() {

        if (!selectedNode) {
            return null;
        }


        if (
            selectedNode.data.type ===
            "developer"
        ) {

            return (
                developerDetails[
                    selectedNode.data.label
                ] || {}
            );

        }


        if (
            selectedNode.data.type ===
            "skill"
        ) {

            return (
                skillDetails[
                    selectedNode.data.label
                ] || {}
            );

        }


        if (
            selectedNode.data.type ===
            "project"
        ) {

            return (
                projectDetails[
                    selectedNode.data.label
                ] || {}
            );

        }


        return {};

    }


    const details =
        getSelectedDetails();


    /* =====================================================
       RENDER
    ===================================================== */

    if (loading) {

        return (
            <div className="graph-page-state">
                Loading knowledge graph...
            </div>
        );

    }


    if (error) {

        return (
            <div className="graph-page-state graph-error">
                {error}
            </div>
        );

    }


    return (

        <main className="graph-page">

            {/* =================================================
               TOP HEADER
            ================================================= */}

            <header className="graph-header">

                <div>

                    <div className="graph-brand">

                        <span className="brand-icon">
                            S
                        </span>

                        <strong>
                            SkillGraph
                        </strong>

                    </div>

                    <p>
                        Explore relationships between
                        developers, skills and projects.
                    </p>

                </div>


                <div className="graph-legend">

                    <span>
                        <i className="legend-dot developer-dot" />
                        Developers
                    </span>

                    <span>
                        <i className="legend-dot skill-dot" />
                        Skills
                    </span>

                    <span>
                        <i className="legend-dot project-dot" />
                        Projects
                    </span>

                </div>

            </header>


            {/* =================================================
               TOOLBAR
            ================================================= */}

            <div className="graph-toolbar">

                <div className="view-select">

                    <span>
                        View
                    </span>

                    <select
                        value={view}
                        onChange={e =>
                            setView(e.target.value)
                        }
                    >

                        <option value="all">
                            All
                        </option>

                        <option value="developer">
                            Developers
                        </option>

                        <option value="skill">
                            Skills
                        </option>

                        <option value="project">
                            Projects
                        </option>

                    </select>

                </div>


                <input
                    className="graph-search"
                    placeholder="Search graph..."
                    value={search}
                    onChange={e =>
                        setSearch(e.target.value)
                    }
                />

            </div>


            {/* =================================================
               MAIN GRAPH LAYOUT
            ================================================= */}

            <div className="graph-layout">


                {/* =================================================
                   LEFT PANEL
                ================================================= */}

                <aside className="graph-sidebar">

                    <div className="sidebar-heading">

                        <span>
                            {view === "all"
                                ? "GRAPH"
                                : view.toUpperCase()}
                        </span>

                        <small>
                            {filteredNodes.length}
                        </small>

                    </div>


                    <div className="sidebar-list">

                        {filteredNodes.map(node => (

                            <button
                                key={node.id}
                                className={`sidebar-item ${
                                    selectedNode?.id === node.id
                                        ? "active"
                                        : ""
                                }`}
                                onClick={() =>
                                    setSelectedNode(node)
                                }
                            >

                                <span
                                    className={`sidebar-dot ${node.data.type}`}
                                />

                                <span>

                                    <strong>
                                        {node.data.label}
                                    </strong>

                                    <small>
                                        {node.data.subtitle}
                                    </small>

                                </span>

                            </button>

                        ))}

                    </div>

                </aside>


                {/* =================================================
                   CENTER GRAPH
                ================================================= */}

                <section className="graph-canvas">

                    <ReactFlow

                        nodes={filteredNodes}

                        edges={filteredEdges}

                        nodeTypes={nodeTypes}

                        onNodeClick={
                            handleNodeClick
                        }

                        fitView

                        minZoom={0.3}

                        maxZoom={1.5}

                        attributionPosition="bottom-left"

                    >

                        <Background
                            color="#252a32"
                            gap={24}
                            size={1}
                        />

                        <Controls />

                        <MiniMap
                            nodeColor={node => {

                                if (
                                    node.data?.type ===
                                    "developer"
                                ) {
                                    return "#4f8cff";
                                }

                                if (
                                    node.data?.type ===
                                    "skill"
                                ) {
                                    return "#28d7c5";
                                }

                                return "#a875ff";

                            }}
                        />

                    </ReactFlow>


                    <div className="graph-category-labels">

                        <span className="category-developers">
                            Developers
                        </span>

                        <span className="category-skills">
                            Skills
                        </span>

                        <span className="category-projects">
                            Projects
                        </span>

                    </div>

                </section>


                {/* =================================================
                   RIGHT DETAILS PANEL
                ================================================= */}

                <aside className="graph-details">

                    {!selectedNode ? (

                        <div className="details-empty">

                            <div className="details-empty-icon">
                                +
                            </div>

                            <h3>
                                Select a node
                            </h3>

                            <p>
                                Click a developer, skill or
                                project to view its details.
                            </p>

                        </div>

                    ) : (

                        <div className="details-content">

                            <button
                                className="back-button"
                                onClick={() =>
                                    setSelectedNode(null)
                                }
                            >
                                ← Clear selection
                            </button>


                            <div
                                className={`details-type ${selectedNode.data.type}`}
                            >
                                {selectedNode.data.type}
                            </div>


                            <h2>
                                {selectedNode.data.label}
                            </h2>


                            <p className="details-subtitle">
                                {selectedNode.data.subtitle}
                            </p>


                            {/* =====================================
                               DEVELOPER
                            ===================================== */}

                            {selectedNode.data.type ===
                                "developer" && (

                                <>

                                    <DetailSection
                                        title="Role"
                                    >
                                        {details.role ||
                                            "Developer"}
                                    </DetailSection>


                                    <DetailSection
                                        title="Skills"
                                    >

                                        <TagList
                                            items={
                                                getItems(
                                                    details.skills
                                                )
                                            }
                                        />

                                    </DetailSection>


                                    <DetailSection
                                        title="Projects"
                                    >

                                        <TagList
                                            items={
                                                getItems(
                                                    details.projects
                                                )
                                            }
                                        />

                                    </DetailSection>

                                </>

                            )}


                            {/* =====================================
                               SKILL
                            ===================================== */}

                            {selectedNode.data.type ===
                                "skill" && (

                                <>

                                    <DetailSection
                                        title="Developers"
                                    >

                                        <TagList
                                            items={
                                                getItems(
                                                    details.developers
                                                )
                                            }
                                        />

                                    </DetailSection>


                                    <DetailSection
                                        title="Projects"
                                    >

                                        <TagList
                                            items={
                                                getItems(
                                                    details.projects
                                                )
                                            }
                                        />

                                    </DetailSection>


                                    <DetailSection
                                        title="Related Skills"
                                    >

                                        <TagList
                                            items={
                                                getItems(
                                                    details.related_skills
                                                )
                                            }
                                        />

                                    </DetailSection>

                                </>

                            )}


                            {/* =====================================
                               PROJECT
                            ===================================== */}

                            {selectedNode.data.type ===
                                "project" && (

                                <>

                                    <DetailSection
                                        title="Description"
                                    >

                                        <p>
                                            {details.description ||
                                                "No description available."}
                                        </p>

                                    </DetailSection>


                                    <DetailSection
                                        title="Developers"
                                    >

                                        <TagList
                                            items={
                                                getItems(
                                                    details.developers
                                                )
                                            }
                                        />

                                    </DetailSection>


                                    <DetailSection
                                        title="Skills"
                                    >

                                        <TagList
                                            items={
                                                getItems(
                                                    details.skills
                                                )
                                            }
                                        />

                                    </DetailSection>

                                </>

                            )}

                        </div>

                    )}

                </aside>

            </div>

        </main>

    );
}


/* =========================================================
   DETAIL COMPONENTS
========================================================= */

function DetailSection({
    title,
    children,
}) {

    return (

        <section className="detail-section">

            <h4>
                {title}
            </h4>

            <div className="detail-value">
                {children}
            </div>

        </section>

    );

}


function TagList({ items }) {

    if (!items?.length) {

        return (
            <span className="no-data">
                No data available
            </span>
        );

    }


    return (

        <div className="tag-list">

            {items.map((item, index) => (

                <span
                    key={`${item}-${index}`}
                    className="detail-tag"
                >
                    {item}
                </span>

            ))}

        </div>

    );

}


export default Graph;