import axios from "axios";
import {
  GetLocalVariablesResponse,
  GetProjectFilesResponse,
} from "@figma/rest-api-spec";

export default class FigmaApi {
  private baseUrl = "https://api.figma.com";
  private token: string;

  constructor(token: string) {
    this.token = token;
  }

  async getProjectFiles(projectKey: string) {
    const resp = await axios.request<GetProjectFilesResponse>({
      url: `${this.baseUrl}/v1/projects/${projectKey}/files`,
      headers: {
        Accept: "*/*",
        "X-Figma-Token": this.token,
      },
    });

    return resp.data;
  }

  async getLocalVariables(fileKey: string) {
    const resp = await axios.request<GetLocalVariablesResponse>({
      url: `${this.baseUrl}/v1/files/${fileKey}/variables/local`,
      headers: {
        Accept: "*/*",
        "X-Figma-Token": this.token,
      },
    });

    return resp.data;
  }
}
