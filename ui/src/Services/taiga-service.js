import axios from "axios";

// TODO: Change the URL to the API Endpoint
const API_URL = "http://127.0.0.1:5000/";

class TaigaService {
  taigaAuthenticate(username, password) {
    return axios.post(API_URL + "authenticate", {
      username,
      password,
    });
  }

  taigaProjectDetails(token, project_slug) {
    return axios.post(
      API_URL + "projectDetails",
      { projectSlug: project_slug },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
  }

  taigaProjectCycleTime(token, project_id) {
    return axios.post(
      API_URL + "cycleTime",
      { projectId: project_id },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
  }

  taigaProjectLeadTime(token, project_id) {
    return axios.post(
      API_URL + "leadTime",
      { projectId: project_id },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
  }
}

export default new TaigaService();
