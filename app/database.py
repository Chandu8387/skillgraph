import os

from dotenv import load_dotenv
from neo4j import GraphDatabase


load_dotenv()


COGNODB_URI = os.getenv("COGNODB_URI")
COGNODB_USERNAME = os.getenv("COGNODB_USERNAME")
COGNODB_PASSWORD = os.getenv("COGNODB_PASSWORD")


if not COGNODB_URI:
    raise RuntimeError(
        "COGNODB_URI is not set"
    )


if not COGNODB_USERNAME:
    raise RuntimeError(
        "COGNODB_USERNAME is not set"
    )


if not COGNODB_PASSWORD:
    raise RuntimeError(
        "COGNODB_PASSWORD is not set"
    )


driver = GraphDatabase.driver(
    COGNODB_URI,
    auth=(
        COGNODB_USERNAME,
        COGNODB_PASSWORD,
    ),
)


def execute_query(
    query,
    parameters=None
):

    print("NEO4J QUERY:")
    print(query)

    print("PARAMETERS:")
    print(parameters or {})

    with driver.session() as session:

        result = session.run(
            query,
            parameters or {}
        )

        rows = [
            record.data()
            for record in result
        ]

        print(
            "QUERY RESULT:",
            rows
        )

        return rows


def test_connection():

    result = execute_query(
        "RETURN 1 AS result"
    )

    return result[0]["result"]