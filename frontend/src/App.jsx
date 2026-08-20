import { Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";

import Dashboard from "./pages/Dashboard";
import Developers from "./pages/Developers";
import Skills from "./pages/Skills";
import LearningPath from "./pages/LearningPath";
import DeveloperDetail from "./pages/DeveloperDetail";
import SkillDetail from "./pages/SkillDetail";
import Projects from "./pages/Projects";
import ProjectDetail from "./pages/ProjectDetail";
import Graph from "./pages/Graph";




function App() {

    return (

        <>

            <Navbar />

            <main className="container">

                <Routes>

                    <Route
                        path="/"
                        element={<Dashboard />}
                    />

                    <Route
                        path="/developers"
                        element={<Developers />}
                    />

                    <Route
                        path="/developers/:name"
                        element={<DeveloperDetail />}
                    />

                    <Route
                        path="/skills"
                        element={<Skills />}
                    />

                    <Route
                        path="/skills/:name"
                        element={<SkillDetail />}
                    />

                    <Route
                        path="/projects"
                        element={<Projects />}
                    />

                    <Route
                        path="/projects/:name"
                        element={<ProjectDetail />}
                    />

                    <Route
                        path="/learning-path"
                        element={<LearningPath />}
                    />

                    <Route
                        path="/graph"
                        element={<Graph />}
                    />

                    <Route
                        path="/graph"
                        element={<Graph />}
                    />

                </Routes>

            </main>

        </>

    );

}


export default App;