import requests

def test_login():
    data = {
        "username": "john",
        "password": "secret"
    }
    response = requests.post("http://localhost:8000/api/auth/token", data=data)
    assert response.status_code == 200
    json_data = response.json()
    assert "access_token" in json_data
