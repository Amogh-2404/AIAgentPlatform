import requests

def test_health():
    response = requests.get("http://localhost:8000/health")
    assert response.status_code == 200
    assert response.json()["status"] == "ok"

def test_list_agents():
    response = requests.get("http://localhost:8000/api/agents/")
    assert response.status_code == 200
    data = response.json()
    assert "agents" in data
