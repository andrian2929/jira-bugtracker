## Introduction

A command-line application written in TypeScript that interacts with Jira's API to fetch issues with type "Bug" and calculate the time spent for the specified time range

## Requirement

- Node 20 or higher

## Usage

1. Set up your jira configuration by copying config.example.json to config.json:
   ```bash
    cp config.example.json config.json
   ```
2. Install all package and dependencies.
   ```bash
    npm run install
   ```
3. Build the project
   ```bash
   npm run build
   ```
4. Run the script
   ```bash
   node dist/Main.js --since 2023-04-04 --until 2024-03-03
   ```
5. This tool will generate json file, output.json
   Example:
   ```json
   [
     {
       "id": "20001",
       "key": "PROJ-2",
       "project": "Project Alpha",
       "isResolved": true,
       "priority": "Medium",
       "summary": "There's a bug here",
       "createdDate": "2024-03-14T09:04:24.703+0700",
       "resolutionDate": "2024-03-14T09:48:34.739+0700",
       "timeSpent": 2650.036,
       "status": "Done",
       "assignee": {
         "displayName": "Alex Johnson",
         "accountId": "70121:abcd1234-101e-4ffc-82cc-db88059b80ad",
         "accountType": "atlassian",
         "active": true,
         "emailAddress": "alex.johnson@example.com"
       }
     }
   ]
   ```

## Run globally

If you wanna run this script globally, just simply run this command first in the project directory

```bash
sudo npm install -g .
```

Now you can run this program every where, just simply by typing this

```bash
issue-tracker --since 2023-04-04 --until 2024-03-03
```

## Help

```bash
Usage: Jira issue tracker

Options:
  -s, --since <since>  Since date
  -u, --until <until>  Until date
  -h, --help           display help for command
```

## Authors

- [@andrian2929](https://www.github.com/andrian2929)

**Made with ❤️ by Aan**
