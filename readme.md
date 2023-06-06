# Scaleway serverless automatic volume backup

This serverless function creates a backup of a given Scaleway volume every day and deletes all backups of the same volume older than seven days.

## Pre-requisite

You need to have infisical and pnpm setup.
Check the guide for further informations.

## Usage

1. Run `pnpm install`
2. Update the infisical's secret accordingly
4. Run `pnpm serverless`
