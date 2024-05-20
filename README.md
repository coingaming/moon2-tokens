# moon2-tokens

## Prerequisites

To use the "Sync Figma variables to tokens" workflow, you must be a full member of an Enterprise org in Figma. To use the "Sync tokens to Figma" workflow, you must also have an editor seat.

Both workflows assume that you have a single Figma file with local variable collections, along with one or more tokens json files in the `tokens/` directory that adhere\* to the [draft W3C spec for Design Tokens](https://tr.designtokens.org/format/). For demonstration purposes, this directory contains the tokens exported from the [Get started with variables](https://www.figma.com/community/file/1253086684245880517/Get-started-with-variables) Community file. Have a copy of this file ready if you want to try out the workflow with these existing tokens.

> \*See `src/token_types.ts` for more details on the format of the expected tokens json files, including the deviations from the draft design tokens spec we've had to make. **We expect there to be one tokens file per variable collection and mode.**

In addition, you must also have a [personal access token](https://www.figma.com/developers/api#access-tokens) for the Figma API to allow these workflows to authenticate with the API. For the "Sync Figma variables to tokens" workflow, the token must have at least the Read-only Variables scope selected. For the "Sync tokens to Figma" workflow, the token must have the Read and write Variables scope selected.

## Usage

Before running either of these workflows, you'll need to create an [encrypted secret](https://docs.github.com/en/actions/security-guides/encrypted-secrets#creating-encrypted-secrets-for-a-repository) in your repository named `GH_ACTION_VARIABLES_SYNC_FIGMA_TOKEN` containing your personal access token.

Both workflows are configured to [run manually](https://docs.github.com/en/actions/using-workflows/manually-running-a-workflow) for demonstration purposes, and are designed to be as conservative as possible in their functionality (see details below).

### Sync Figma variables to tokens

To run the "Sync Figma variables to tokens" workflow:

- Open the workflow under the **Actions** tab in your repository and click **Run workflow**
- You will be asked to provide the file key of the Figma file. The file key can be obtained from any Figma file URL: `https://www.figma.com/file/{file_key}/{title}`.
- After the workflow finishes, you should see a new pull request if there are changes to be made to the tokens files in the `tokens/` directory. If there are no changes to be made, then a pull request will not be created.

This workflow has some key behaviors to note:

- After generating the new tokens json files, this workflow creates a pull request for someone on the team to review. If you prefer, you can modify the workflow to commit directly to a designated branch without creating a pull request.
- If a variable collection or mode is removed from the Figma file, the corresponding tokens file will not be removed from the codebase.

## The StyleDictionary bit

Once the tokens are extracted from Figma to JSON, a script `removedollarsigns.sh` removes all **$ dollar signs** from the JSON strings, required for StyleDictionary.

This repo adds [StyleDictionary](https://amzn.github.io/style-dictionary/#/), which takes `.json` files in the `tokens/` directory (which should have been populated by the variables sync) and converts them to the specified format. The StyleDictionary configuration is found in `config.json` which details output location, format (SwiftUI, CSS etc).

StyleDictionary licensed [under the Apache License](https://raw.githubusercontent.com/amzn/style-dictionary/main/LICENSE), Version 2.0 (the "License") Copyright 2017 Amazon.com, Inc. or its affiliates. All Rights Reserved.
