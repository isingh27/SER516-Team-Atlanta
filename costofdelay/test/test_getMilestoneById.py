import pytest
from unittest.mock import Mock, patch

import requests
from model import mock_milestone_data
from taigaApi.milestone.getMilestoneById import MilestoneFetchingError, get_milestone_by_id
import os
import json


@pytest.fixture() 
def mock_env():
    with patch.dict("os.environ", {"TAIGA_URL": "https://test.taiga.io/api/v1/"}):
        yield


def test_get_milestone_by_id_success(mock_env):
    with patch("requests.get") as mock_get:    
        
        mock_get.return_value.json.return_value = mock_milestone_data.data
         # Call the function with mocked data
        milestones = get_milestone_by_id( 376612, "valid_auth_token")

        # Assert the expected behavior
        assert milestones == mock_milestone_data.data


def test_get_milestone_by_id_error_connection(mock_env):
    # Simulate a connection error
    with patch("requests.get") as mock_get:
        mock_get.side_effect = requests.exceptions.ConnectionError("Connection error")

        # Call the function
        with pytest.raises(MilestoneFetchingError) as result:
            get_milestone_by_id(376612, "valid_token")

        # Assert expected behavior
        assert result.type is MilestoneFetchingError
        assert result.value.status_code == "CONNECTION_ERROR"
        assert "Connection error" in result.value.reason



def test_get_milestone_by_id_error_unauthorized(mock_env):
    # Simulate a connection error
    with patch("requests.get") as mock_get:
        mock_get.side_effect = MilestoneFetchingError(401, "Client Error: Unauthorized")

        # Call the function
        with pytest.raises(MilestoneFetchingError) as result:
            get_milestone_by_id(376612, "invalid_token")

        # Assert expected behavior
        assert result.type is MilestoneFetchingError
        assert result.value.status_code == 401
        assert "Client Error: Unauthorized" in result.value.reason
