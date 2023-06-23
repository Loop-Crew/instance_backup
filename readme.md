# Serverless automatic volume backup

This serverless function creates a backup of a given Scaleway volume every day and deletes all backups of the same volume older than seven days.

## Pre-requisite

You need to have infisical and pnpm setup.
Check the Crew's guide for further informations.

## Usage

1. Run `pnpm install`
2. Update the infisical's secret accordingly
4. Run `pnpm deploy`

## How to test ?

1. Run `infisical run -- NODE_ENV=test node handler.js` to start the local server
2. Run `curl -X GET http://localhost:8080` against it

## Ressource
- [How to test locally with Scaleway Serverless ?](https://github.com/scaleway/serverless-functions-node#%EF%B8%8F-quickstart)