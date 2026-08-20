from database import test_connection


if __name__ == "__main__":
    result = test_connection()
    print(f"CognoDB connection successful: {result}")