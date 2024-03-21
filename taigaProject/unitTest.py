import unittest
from unittest.mock import patch
from server import app
from server import work_in_progress, get_project_by_slug


# Unit test for the /authenticate endpoint - to test if api works or not.


class TestAuthenticateEndpoint(unittest.TestCase):

    @patch('server.authenticate')
    def test_authenticate_success(self, mock_authenticate):
        # Mocking authenticate function to return a token
        print("mock_authenticate --> ", mock_authenticate.return_value)
        mock_authenticate.return_value = "mocked_token"

        # Taking username and password as user inputs
        username = input("Enter username: ")
        password = input("Enter password: ")

        # Sending a POST request to the /authenticate endpoint with user inputs
        client = app.test_client()
        print(app)
        response = client.post('/authenticate',
                               json={"username": username,
                                     "password": password})
        response = client.post('/authenticate', json={
            "username": username, "password": password})
        data = response.get_json()
        print("data --> ", data)

        # Asserting the response status code, status, and token
        self.assertEqual(response.status_code, 200)
        self.assertEqual(data['status'], 'success')
        self.assertEqual(data['token'], 'mocked_token')

    def test_authenticate_missing_data(self):
        # Sending a POST request to the /authenticate endpoint without any data
        client = app.test_client()
        print("client --> ", client)
        response = client.post('/authenticate', json={})
        print("response2 --> ", response)
        # data = response.get_json()

        # Asserting the response status code and message
        self.assertEqual(response.status_code, 500)

    @patch('server.request')
    @patch('server.get_project_by_slug')
    def test_get_project_id_success(self, mock_get_project_by_slug):
        # Mocking get_project_by_slug function to return a project ID
        mock_get_project_by_slug.return_value = "mock_project_id"

        # Note: No need to use test_request_context here as we're using the test client
        response = self.client.post('/getProjectId', json={"projectSlug": "mock_project_slug"}, headers={"Authorization": "Bearer mocked_token"})
        data = response.get_json()

        # Asserting the response status code and project ID
        self.assertEqual(response.status_code, 200)
        self.assertEqual(data['status'], 'success')
        self.assertEqual(data['projectId'], 'mock_project_id')

    @patch('server.get_closed_tasks')
    @patch('server.authenticate')
    def test_lead_time_success(self, mock_authenticate, mock_get_closed_tasks):
        # Mocking authenticate function to return a token
        mock_authenticate.return_value = "mocked_token"

        # Mocking get_closed_tasks function to return a list of closed tasks
        mock_closed_tasks = [
            {
                "id": "123",
                "ref": "REF123",
                "subject": "Task 1",
                "created_date": "2024-02-07T18:46:54.396Z",
                "finished_date": "2024-02-07T23:12:30.051Z"
            },
            {
                "id": "124",
                "ref": "REF124",
                "subject": "Task 2",
                "created_date": "2024-02-07T18:46:54.396Z",
                "finished_date": "2024-02-07T23:12:30.051Z"
            }
        ]
        mock_get_closed_tasks.return_value = mock_closed_tasks

        # Sending a POST request to the /leadTime endpoint with a
        # project ID and token
        client = app.test_client()
        response = client.post(
            '/leadTime',
            json={"projectId": "mock_project_id"},
            headers={"Authorization": "Bearer mocked_token"})
        # Sending a POST request to the /leadTime endpoint
        # with a project ID and token
        client = app.test_client()
        response = client.post('/leadTime', json={
            "projectId": "mock_project_id"}, headers={
                "Authorization": "Bearer mocked_token"})
        data = response.get_json()

        # Asserting the response status code and lead time calculation
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(data['plotData']), 2)

    @patch('server.get_task_status')
    @patch('server.get_all_sprint_ids')
    def test_work_in_progress_success(self, mock_get_all_sprint_ids,
                                      mock_get_task_status):

        mock_sprints = [
            ("Sprint1", 376610),
            ("Sprint2", 376604),
            ("Sprint3", 376606),
            ("Sprint4", 376609),
            ("Sprint5", 376602),
        ]
        mock_get_all_sprint_ids.return_value = mock_sprints

        mock_get_task_status.side_effect = [
            [{'status': 'DONE'}] * 20,
            [{'status': 'DONE'}] * 13 + [{'status': 'In progress'}] * 6 +
            [{'status': 'Blocked'}] * 1 + [{'status': 'Ready for test'}] * 4,
            [],
            [],
            [],
        ]

        client = app.test_client()
        response = client.post('/workInProgress',
                               json={"projectId": "1521714"},
                               headers={"Authorization":
                                        "Bearer mocked_token"})
        data = response.get_json()

        self.assertEqual(response.status_code, 200)
        self.assertEqual(data['status'], 'success')
        self.assertIn('Sprint1', data['data'])
        self.assertIn('Sprint2', data['data'])
        sprint1 = data['data']['Sprint1']
        self.assertEqual(sprint1['New'], 0)


    def setUp(self):
        self.client = app.test_client()
        self.ctx = app.app_context()
        self.ctx.push()

    def tearDown(self):
        self.ctx.pop()

    
    @patch('server.get_closed_tasks')
    @patch('server.get_milestone_stats')
    def test_throughput_histogram_success(self, mock_get_milestone_stats, mock_get_closed_tasks):
        # Mocking the necessary functions and data
        mock_get_milestone_stats.return_value = {
            'estimated_start': '2023-01-01',
            'estimated_finish': '2023-01-10'
        }
        
        # Sample closed tasks data
        mock_closed_tasks = [
            {"id": "1", "finished_date": "2023-01-02T12:00:00Z"},
            {"id": "2", "finished_date": "2023-01-02T12:00:00Z"},
            {"id": "3", "finished_date": "2023-01-03T12:00:00Z"},
            {"id": "4", "finished_date": "2023-01-04T12:00:00Z"},
            {"id": "5", "finished_date": "2023-01-05T12:00:00Z"},
            {"id": "6", "finished_date": "2023-01-05T12:00:00Z"},
            {"id": "7", "finished_date": "2023-01-07T12:00:00Z"},
            {"id": "8", "finished_date": "2023-01-08T12:00:00Z"},
            {"id": "9", "finished_date": "2023-01-09T12:00:00Z"}
        ]
        mock_get_closed_tasks.return_value = mock_closed_tasks

        # Sending a POST request to the endpoint with project and sprint IDs
        client = app.test_client()
        response = client.post('/throughputHistogram', json={"projectId": "1521714", "sprintId": "376610"}, headers={"Authorization": "Bearer mocked_token"})
        data = response.get_json()
        print("data --> ", data)

        # Asserting the response status code and data format
        self.assertEqual(response.status_code, 200)

    @patch('server.get_milestone_stats')
    def test_cumulative_flow_diagram_success(self, mock_get_milestone_stats):
        # Mocking get_milestone_stats function to return a milestone statistics
        mock_get_milestone_stats.return_value = {
            'estimated_start': '2023-01-01',
            'estimated_finish': '2023-01-10'
        }
        
        expected_response = {
            "data": [
                {
                "closed": 0,
                "date": "2024-01-29",
                "inProgress": 0,
                "new": 0
                },
                {
                "closed": 0,
                "date": "2024-01-30",
                "inProgress": 0,
                "new": 0
                },
                {
                "closed": 0,
                "date": "2024-01-31",
                "inProgress": 0,
                "new": 0
                }, 
            ]
        }

        # Sending a POST request to the endpoint with project and sprint IDs
        response = self.client.post('/cumulativeFlowDiagram', json={"projectId": "1521714", "sprintId": "376610"}, headers={"Authorization": "Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzEwOTI0Nzk3LCJqdGkiOiJhYWY1ZGZlOGJiNjE0ZjVlYTc3NjJhZmRjOWRiYzU2MCIsInVzZXJfaWQiOjU5ODM3NH0.U1aV01uVEq8z0yHS6w_vGu8eQdSH8cjIm_cpu9E3tvv42a9dv2qTEzFX-Ykq8vxjf1bceEmgAtaqV-ngdmLZEeDQ0PN8N6bBRU_qAyW3IF08k71lO00nQ_TZZdAyU0brAvAaH1_bfELLANsH2u2kzPHfq3-_z9n5BBip8OFJxwjWUJSNtox9RwhDjMrPtuFaouvNQCeM0cZZsdvQn80I6S0puiECqsd2kRn-Ul65lBIMZ3rJUVu4kmiTySMmn6asKNCv_3DBGF4Q2gP349j1oCoo-jOEBlusEgcRrBw_BYjaqbPDjjjAItEiwneuw5wPDv16DQwsATVOxBYDmTvGGA"})
        data = response.get_json()

        self.assertEqual(response.status_code, 200)
        self.assertEqual(data['status'], 'success')
        self.assertIsInstance(data['data'], list)
        for expected_item, actual_item in zip(expected_response['data'], data['data']):
            self.assertEqual(set(expected_item.keys()), set(actual_item.keys()))

if __name__ == '__main__':
    unittest.main()