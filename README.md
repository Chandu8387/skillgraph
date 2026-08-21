**# SkillGraph**



A graph-based developer skill and project exploration platform built with \*\*FastAPI, React, and CognoDB\*\*.



SkillGraph models relationships between developers, skills, and projects and provides an interactive way to explore those relationships and discover learning paths.



**## Live Demo**



https://skillgraph-theta.vercel.app/



**## Features**



\* Interactive developer-skill-project knowledge graph

\* Developer profiles and skill relationships

\* Skill exploration

\* Project exploration

\* Multi-hop learning path discovery

\* Dashboard statistics

\* Search and filtering

\* Responsive mobile interface

\* REST API powered by FastAPI

\* Graph data stored and queried using CognoDB



**## Why a Graph Database?**



The relationships between developers, skills, and projects are naturally represented as a graph.



For example:



```text

Developer

&#x20;  ↓ HAS\_SKILL

Skill

&#x20;  ↓ USED\_IN

Project

```



This makes relationship-based queries and multi-hop traversal easier to express than a traditional relational structure.



SkillGraph also uses graph traversal to discover learning paths between skills.



**## Data Model**



The main entities are:



\* \*\*Developer\*\*

\* \*\*Skill\*\*

\* \*\*Project\*\*



Relationships connect these entities to represent skills possessed by developers and skills used by projects.



**## Application Screenshots**



\### Dashboard



!\[Dashboard](docs/dashboard.png)



\### Knowledge Graph



!\[Knowledge Graph](docs/graph.png)



\### Developers



!\[Developers](docs/Developers.png)



\### Skills



!\[Skills](docs/Skills.png)



\### Projects



!\[Projects](docs/Projects.png)



\### Learning Path



!\[Learning Path](docs/learningpath.png)



**## Project Structure**



```text

skillgraph/

├── backend/

│   ├── app/

│   ├── main.py

│   └── ...

├── frontend/

│   ├── src/

│   ├── package.json

│   └── ...

├── docs/

│   ├── dashboard.png

│   ├── graph.png

│   ├── Developers.png

│   ├── Skills.png

│   ├── Projects.png

│   └── learningpath.png

└── README.md

```



**## API**



The backend exposes REST endpoints for:



```text

GET /api/stats



GET /api/developers

GET /api/developers/{name}



POST /api/developers



GET /api/skills

GET /api/skills/{name}



GET /api/projects

GET /api/projects/{name}



GET /api/learning-path?start={start}\&target={target}

```



**## Environment Variables**



The frontend uses:



```text

VITE\_API\_BASE\_URL

```



For production, this points to the deployed backend:



```text

https://skillgraph-backend-sp42.onrender.com

```



For local development, configure the variable according to your local backend URL.



\## Running Locally



\### Backend



Install the Python dependencies and start the FastAPI application.



```bash

pip install -r requirements.txt

```



Then run the backend using your project's configured FastAPI/Uvicorn command.



\### Frontend



```bash

cd frontend

npm install

npm run dev

```



Configure the frontend environment variable before starting:



```text

VITE\_API\_BASE\_URL=<your-backend-url>

```



**## Deployment**



**### Frontend**



The frontend is deployed on Vercel.



**Production URL:**



https://skillgraph-theta.vercel.app/



**### Backend**



The backend is deployed on Render.



**Backend URL:**



https://skillgraph-backend-sp42.onrender.com/



**## Testing**



The deployed application was tested across:



\* Dashboard

\* Knowledge Graph

\* Developers

\* Skills

\* Projects

\* Learning Path

\* API connectivity

\* Mobile responsive layout



**## Demo Video**



A short screen recording demonstrates the application's main features and graph-based functionality.



\## Author



Chandu



file: video\_demo



