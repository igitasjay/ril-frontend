import axios from "axios";
import { Bus } from "../types";

const API_BASE_URL = "http://localhost:4000";

export async function getAvailability(
  from: string,
  to: string,
): Promise<Bus[]> {
  const response = await axios.get(`${API_BASE_URL}/availability`, {
    params: { from, to },
  });

  return response.data.availableroutes;
}
