import pytest
from unittest.mock import Mock, patch

import requests
from model import mock_task_custom_attributes_depenson, mock_get_custom_attribute_values_from_task, mock_task_data
from taigaApi.task.getTasks import TaskFetchingError, get_custom_attribute_values_from_task, get_task_custom_attribute_type_id, get_tasks


@pytest.fixture() 
def mock_env():
    with patch.dict("os.environ", {"TAIGA_URL": "https://test.taiga.io/api/v1/"}):
        yield

def test_get_task_custom_attribute_type_id_success(mock_env):
    project_id = 1525740
    auth_token = "valid token"
    custom_attribute_name = "DependsOn"

    with patch("requests.get") as mock_get:
        mock_get.return_value.json.return_value = mock_task_custom_attributes_depenson.data

        result = get_task_custom_attribute_type_id(project_id, auth_token, custom_attribute_name)

        assert result == str(mock_task_custom_attributes_depenson.data[0]['id'])
        

def test_get_task_custom_attribute_type_id_connection_error(mock_env):
    project_id = 1525740
    auth_token = "valid token"
    custom_attribute_name = "DependsOn"

    # Simulate a 401 Unauthorized error
    with patch("requests.get") as mock_get:
        mock_get.side_effect = requests.exceptions.ConnectionError("Connection error")
         # Call the function
        with pytest.raises(TaskFetchingError) as result:
            get_task_custom_attribute_type_id(project_id, auth_token, custom_attribute_name)

            # Assert expected behavior
            assert result.type is TaskFetchingError
            assert result.value.status_code == "CONNECTION_ERROR"
            assert "Connection error" in result.value.reason

def test__get_task_custom_attribute_type_id_unnauthorized_error(mock_env):
    project_id = 1525740
    auth_token = "valid token"
    custom_attribute_name = "DependsOn"

    # Simulate a 401 Unauthorized error
    with patch("requests.get") as mock_get:
        mock_get.side_effect = TaskFetchingError(401, "Client Error: Unauthorized")

        # Call the function
        with pytest.raises(TaskFetchingError) as result:
            get_task_custom_attribute_type_id(project_id, auth_token, custom_attribute_name)
            
            # Assert expected behavior
            assert result.type is TaskFetchingError
            assert result.value.status_code == 401
            assert "Client Error: Unauthorized" in result.value.reason


def test_get_custom_attribute_values_from_task_success(mock_env):
     task_id =  5637875
     auth_token = "valid token"
     with patch("requests.get") as mock_get:
        mock_get.return_value.json.return_value = mock_get_custom_attribute_values_from_task.data
        result = get_custom_attribute_values_from_task(task_id, auth_token)

        assert result == mock_get_custom_attribute_values_from_task.data["attributes_values"]
        

def test_get_custom_attribute_values_from_task_error(mock_env):
    task_id =  5637875
    auth_token = "valid token"

    # Simulate a 401 Unauthorized error
    with patch("requests.get") as mock_get:
        mock_get.side_effect = requests.exceptions.ConnectionError("Connection error")
         # Call the function
        with pytest.raises(TaskFetchingError) as result:
            get_custom_attribute_values_from_task(task_id, auth_token)

            # Assert expected behavior
            assert result.type is TaskFetchingError
            assert result.value.status_code == "CONNECTION_ERROR"
            assert "Connection error" in result.value.reason

def test_get_custom_attribute_values_from_task_unnauthorized_error(mock_env):
    task_id =  5637875
    auth_token = "valid token"

    # Simulate a 401 Unauthorized error
    with patch("requests.get") as mock_get:
        mock_get.side_effect = TaskFetchingError(401, "Client Error: Unauthorized")

        # Call the function
        with pytest.raises(TaskFetchingError) as result:
            get_custom_attribute_values_from_task(task_id, auth_token)
            
            # Assert expected behavior
            assert result.type is TaskFetchingError
            assert result.value.status_code == 401
            assert "Client Error: Unauthorized" in result.value.reason

def test_get_tasks(mock_env):
    
    project_id = 1522285
    auth_token = "valid_auth_token"
    
    with patch("requests.get") as mock_get:         

        mock_get.return_value.json.return_value = mock_task_data.data

         # Call the function with mocked data
        tasks = get_tasks( project_id,auth_token)

        # Assert the expected behavior
        assert tasks == mock_task_data.data


def test_get_all_tasks_connection_error(mock_env):
    project_id = 1522285
    auth_token = "valid_token"
    # Simulate a connection error
    with patch("requests.get") as mock_get:
        mock_get.side_effect = requests.exceptions.ConnectionError("Connection error")

        # Call the function
        with pytest.raises(TaskFetchingError) as result:
            get_tasks(project_id, auth_token)

        # Assert expected behavior
        assert result.type is TaskFetchingError
        assert result.value.status_code == "CONNECTION_ERROR"
        assert "Connection error" in result.value.reason

def test_get_tasks_error_unauthorized(mock_env):
    project_id = 1522285
    auth_token = "invalid_token"
    # Simulate a connection error
    with patch("requests.get") as mock_get:
        mock_get.side_effect = TaskFetchingError(401, "Client Error: Unauthorized")

        # Call the function
        with pytest.raises(TaskFetchingError) as result:
            get_tasks(project_id, auth_token)

        # Assert expected behavior
        assert result.type is TaskFetchingError
        assert result.value.status_code == 401
        assert "Client Error: Unauthorized" in result.value.reason

