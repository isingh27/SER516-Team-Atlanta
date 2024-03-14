import axios from "axios";

// TODO: Change the URL to the API Endpoint
const API_URL = process.env.REACT_APP_BACKEND_URI || "http://127.0.0.1:5000/";

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

  taigaProjectCycleTimesPerTask(token, project_id) {
    return axios.post(
      API_URL + "cycleTimesPerTask",
      { projectId: project_id },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
  }

  taigaProjectCycleTimesPerUserStory(token, project_id) {
    return axios.post(
      API_URL + "cycleTimesPerUserStory",
      { projectId: project_id },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
  }
  taigaProjectSprints(token, project_id) {
    return axios.post(
      API_URL + "sprints",
      { projectId: project_id },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
  }
  taigaProjectBurnDownChart(token, sprint_id) {
    return axios.post(
      API_URL + "burndownChart",
      { sprintId: sprint_id },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
  }
  taigaBurnDownBV(token, project_id, sprint_id) {
    return axios.post(
      API_URL + "BVBurndown",
      { projectId: project_id, sprintId: sprint_id },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
  }

  taigaProjectWorkInProgress(token, project_id) {
    return axios.post(
      API_URL + "workInProgress",
      { projectId: project_id },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
  }
  taigaProjectThroughputDaily(token, project_id, sprint_id) {
    return axios.post(
      API_URL + "throughputDaily",
      { projectId: project_id, sprintId: sprint_id },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
  }
  taigaProjectThroughputHistogram(token, project_id, sprint_id) {
    return axios.post(
      API_URL + "throughputHistogram",
      { projectId: project_id, sprintId: sprint_id },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
  }
  taigaProjectCumulativeFlowDiagram(token, project_id, sprint_id) {
    return axios.post(
      API_URL + "cumulativeFlowDiagram",
      { projectId: project_id, sprintId: sprint_id },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
  }

  taigaUserProjects(token) {
    return axios.get(API_URL + "listUserProjects", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
}

export default new TaigaService();
