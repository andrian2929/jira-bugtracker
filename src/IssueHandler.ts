import JiraClient from './JiraClient';

interface Issue {
  id: string;
  key: string;
  project: string;
  summary: string;
  isResolved: boolean;
  createdDate: string;
  priority: string;
  resolutionDate: string;
  timeSpent: number | null;
  status: string;
  assignee: User;
}

interface User {
  displayName: string;
  accountId: string;
  accountType: string;
  active: boolean;
  emailAddress: string;
}

export default class IssueHandler {
  constructor(private jiraClient: JiraClient) {}

  /**
   * Retrieves and processes issues.
   *
   * @returns {Promise<Issue[]>}
   */
  private async processIssues(): Promise<Issue[]> {
    const issues: Issue[] = [];

    let startAt = 0;
    const maxResults = 50;

    while (true) {
      try {
        const response = await this.jiraClient.getIssues(startAt, maxResults);

        if (response.issues.length === 0) break;

        for (const issue of response.issues) {
          const createdDate = issue.fields.created;
          const resolutionDate = issue.fields.resolutiondate;

          const timeSpent = await this.getTimeSpent(
            createdDate,
            resolutionDate
          );

          issues.push({
            id: issue.id,
            key: issue.key,
            project: issue.fields.project.name,
            isResolved: issue.fields.resolution !== null,
            priority: issue.fields.priority.name,
            summary: issue.fields.summary,
            createdDate,
            resolutionDate,
            timeSpent: createdDate ? timeSpent : null,
            status: issue.fields.status.name,
            assignee: {
              displayName: issue.fields.assignee.displayName,
              accountId: issue.fields.assignee.accountId,
              accountType: issue.fields.assignee.accountType,
              active: issue.fields.assignee.active,
              emailAddress: issue.fields.assignee.emailAddress,
            },
          });
        }

        startAt += maxResults;
      } catch (error) {
        console.error(error);
      }
    }

    return issues;
  }

  /**
   * Retrieves users from Jira and processes their issues.
   *
   * @returns {Promise<Issue[]>}
   */
  public async execute(): Promise<Issue[]> {
    const issues = await this.processIssues();

    return issues;
  }

  /**
   * Calculates the time spent between the created date and the resolution date.
   *
   * @param {string} createdDate
   * @param {string|null} resolutionDate
   * @returns {number|null} The spent time in seconds, or null
   *
   */
  private async getTimeSpent(
    createdDate: string,
    resolutionDate: string
  ): Promise<number | null> {
    if (!resolutionDate) return null;

    const created = new Date(createdDate);
    const resolved = new Date(resolutionDate);

    return (resolved.getTime() - created.getTime()) / 1000;
  }
}
