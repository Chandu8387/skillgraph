from app.database import execute_query


def verify_database():
    print("\n--- Node counts ---")

    queries = {
        "Developers": """
            MATCH (n:Developer)
            RETURN count(n) AS count
        """,
        "Skills": """
            MATCH (n:Skill)
            RETURN count(n) AS count
        """,
        "Technologies": """
            MATCH (n:Technology)
            RETURN count(n) AS count
        """,
        "Projects": """
            MATCH (n:Project)
            RETURN count(n) AS count
        """,
        "Resources": """
            MATCH (n:Resource)
            RETURN count(n) AS count
        """,
    }

    for name, query in queries.items():
        result = execute_query(query)
        print(f"{name}: {result[0]['count']}")

    print("\n--- Relationship counts ---")

    relationship_query = """
        MATCH ()-[r]->()
        RETURN type(r) AS relationship, count(r) AS count
        ORDER BY relationship
    """

    relationships = execute_query(relationship_query)

    for relationship in relationships:
        print(
            f"{relationship['relationship']}: "
            f"{relationship['count']}"
        )

    print("\n--- Multi-hop traversal test ---")

    path_query = """
        MATCH path =
            (start:Skill {name: $start})
            -[:PREREQUISITE_OF*1..3]->
            (target:Skill {name: $target})
        RETURN [node IN nodes(path) | node.name] AS path
        LIMIT 10
    """

    paths = execute_query(
        path_query,
        {
            "start": "Python",
            "target": "Django",
        },
    )

    for path in paths:
        print(" -> ".join(path["path"]))


if __name__ == "__main__":
    verify_database()