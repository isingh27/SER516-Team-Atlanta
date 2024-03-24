import unittest
import server
from unittest.mock import patch

class SmokeTest(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        server.app.testing = True
        cls.client = server.app.test_client()

    def test_index_route(self):

        response = self.client.get('/')
        self.assertEqual(response.status_code, 200)
        self.assertIn('Hello, World!', response.json['message'])

    @patch('server.authenticate')
    def test_authenticate_route(self, mock_authenticate):

        mock_authenticate.return_value = 'mock_auth_token'
        response = self.client.post('/authenticate', json={
            'username': 'dummy_user',
            'password': 'dummy_password'
        })
        self.assertEqual(response.json['status'], 'success')

if __name__ == '__main__':
    unittest.main()
