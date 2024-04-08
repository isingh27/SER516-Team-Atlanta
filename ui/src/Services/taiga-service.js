import axios from "axios";

// TODO: Change the URL to the API Endpoint
const API_URL = process.env.REACT_APP_BACKEND_URI || "http://127.0.0.1:5000/";

class TaigaService {
  taigaAuthenticate(username, password) {
    return axios.post(API_URL + "auth", {
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
      API_URL + "cycleTime/perTask",
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
      API_URL + "cycleTime/perUserStory",
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

  taigaBurndownTotal(token, project_id, sprint_id) {
    return axios.post(
      API_URL + "totalBurndown",
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
      API_URL + "throughput/daily",
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
      API_URL + "throughput/histogram",
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

  taigaUserProjectsLeadTimeByRange(token, project_id, startDate, endDate) {
    return axios.post(
      API_URL + "leadTime/byRange",
      { projectId: project_id, startDate: startDate, endDate: endDate },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
  }
}

export default new TaigaService();
