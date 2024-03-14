import axios from 'axios';

interface JiraConfig {
  jiraApiUrl: string;
  jiraApiToken: string;
  jiraEmail: string;
}

interface Option {
  since: string;
  until: string;
}

interface Issue {
  id: string;
  key: string;
  project: string;
  summary: string;
  isResolved: boolean;
  createdDate: string;
  resolutionDate: string;
  timeSpent: number | null;
  status: string;
}

export default class JiraClient {
  private readonly authToken: string;
  constructor(
    private readonly config: JiraConfig,
    private readonly option: Option
  ) {
    this.authToken = Buffer.from(
      `${config.jiraEmail}:${config.jiraApiToken}`
    ).toString('base64');
  }

  /**
   * Retrieves all issues from Jira with type bug.
   *
   * @param startAt
   * @param maxResults
   * @returns {Promise<any>} List of issues.
   */
  public async getIssues(
    startAt: number = 0,
    maxResults: number = 50
  ): Promise<any> {
    try {
      const response = await axios.get(
        `${this.config.jiraApiUrl}/search?jql=(created>=${this.option.since} and created<=${this.option.until}) and issueType="Bug"&startAt=${startAt}&maxResults=${maxResults}`,
        {
          headers: {
            Authorization: `Basic ${this.authToken}`,
          },
        }
      );

      return response.data;
    } catch (error) {
      console.error(error);
    }
  }
}
