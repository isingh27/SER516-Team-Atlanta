import unittest
from unittest.mock import patch
from server import app


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
    def test_get_project_id_success(self, mock_get_project_by_slug, mock_request):
        # Mocking get_project_by_slug function to return a project ID
        mock_get_project_by_slug.return_value = "mock_project_id"

        # Sending a POST request to the /getProjectId endpoint with a project slug and token
        client = app.test_client()
        response = client.post('/getProjectId', json={"projectSlug": "mock_project_slug"}, headers={"Authorization": "Bearer mocked_token"})
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
    @patch('server.get_closed_tasks')
    @patch('server.get_milestone_stats')
    @patch('server.authenticate')
    def test_throughputHistogram_success(self, mock_authenticate,
                                         mock_get_milestone_stats, mock_get_closed_tasks):
        # Mocking authenticate function to return a token
        mock_authenticate.return_value = "mocked_token"

        # Mocking get_milestone_stats function
        # to return a list of milestone stats
        mock_milestone_stats = {
                "name": "Sprint 1",
                "estimated_start": "2024-01-29",
                "estimated_finish": "2024-02-18",
                "total_points": {
                    "9184512": 91.0
                },
                "completed_points": [
                    91.0
                ],
                "total_userstories": 12,
                "completed_userstories": 12,
                "total_tasks": 49,
                "completed_tasks": 49,
                "iocaine_doses": 0,
                "days": [
                    {
                        "day": "2024-01-29",
                        "name": 29,
                        "open_points": 91.0,
                        "optimal_points": 91.0
                    },
                    {
                        "day": "2024-01-30",
                        "name": 30,
                        "open_points": 91.0,
                        "optimal_points": 86.45
                    }]
            }

        mock_get_milestone_stats.return_value = mock_milestone_stats

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

        # Sending a POST request to the /throughputHistogram endpoint with a project ID and token
        client = app.test_client()
        response = client.post('/throughputHistogram', json={"projectId": "mock_project_id", "sprintId": "mock_sprint_id"}, headers={"Authorization": "Bearer mocked_token"})
        data = response.get_json()
        print("data -->", data)
        # Asserting the response status code and throughput histogram calculation
        self.assertEqual(response.status_code, 200)
        # self.assertEqual(len(data['plotData']), 2)


if __name__ == '__main__':
    unittest.main()
