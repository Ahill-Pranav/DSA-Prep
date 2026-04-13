import axios from "axios";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

const api = axios.create({
  baseURL: API_BASE_URL,
});

export const getDashboardStats = async () => {
  const response = await api.get("/stats/dashboard");
  return response.data;
};

export const toggleProblem = async (problemId: string) => {
  const response = await api.post(`/problems/toggle/${problemId}`);
  return response.data;
};

export const getProblems = async (phaseId?: number) => {
  const response = await api.get("/problems/", { params: { phase_id: phaseId } });
  return response.data;
};

export default api;
