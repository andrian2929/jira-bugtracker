#!/usr/bin/env node

import { program } from 'commander';
import * as fs from 'fs';
import JiraClient from './JiraClient';
import jiraConfig from '../config.json';
import IssueHandler from './IssueHandler';

interface Option {
  since: string;
  until: string;
}

interface JiraConfig {
  jiraApiUrl: string;
  jiraApiToken: string;
  jiraEmail: string;
}

class Main {
  private readonly option: Option;
  private readonly jiraConfig: JiraConfig;

  constructor() {
    this.configureCommander();
    this.option = program.opts();
    this.jiraConfig = jiraConfig;
  }

  /**
   * Configures the commander by adding required options for the program.
   */
  private configureCommander() {
    program
      .requiredOption('-s, --since <since>', 'Since date')
      .requiredOption('-u, --until <until>', 'Until date')
      .usage('Jira issue tracker')
      .parse();
  }

  private validateOption() {
    const dateRegexPattern = /^\d{4}-\d{2}-\d{2}$/;
    if (
      !dateRegexPattern.test(this.option.since) ||
      !dateRegexPattern.test(this.option.until)
    ) {
      throw new Error('Invalid date format');
    }

    // Increment until date by 1
    const untilDate = new Date(this.option.until);
    untilDate.setDate(untilDate.getDate() + 1);
    this.option.until = untilDate.toISOString().split('T')[0];
  }

  /**
   * Runs the application.
   */
  public async run() {
    this.validateOption();

    const jiraClient = new JiraClient(this.jiraConfig, this.option);
    const issueHandler = new IssueHandler(jiraClient);
    this.write('output.json', await issueHandler.execute());
  }

  private write(filename: string, data: any) {
    if (fs.existsSync(filename)) fs.unlinkSync(filename);
    fs.writeFileSync(filename, JSON.stringify(data, null, 2));
  }
}

const app = new Main();

(async () => {
  try {
    await app.run();
  } catch (error) {
    console.error(error);
  }
})();
