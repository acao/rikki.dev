---
title: Exciting news for the GraphQL LSP & Vscode ecosystem!
date: 2024/2/01
description: "Updates about my grant from the GraphQL Foundation"
---

I'm excited to announce that I've received a significant grant from the GraphQL Foundation to help ensure the stability of and preparedness for the ecosystem.

## What is the current status of the GraphQL LSP and IDE Ecosystem?

There have been many changes and improvements since my last article about graphql LSP and vscode-graphql


### `graphql-language-service-interface`, `graphql-language-service-parser`, `graphql-language-service-utils`, and `graphql-language-service-types` were all combined into `graphql-language-service`

This change helps us simplify the repository immensely!  These packages are used isomorphically by both web modes - codemirror, monaco, as well as the language server and thus the IDE modes. Now that we have modern tree shaking, dividing the packages responsibilities like these is no longer necessary.

The CLI that previously lived at `graphql-language-service` was moved to the more descriptive `graphql-language-service-cli`

### `vscode-graphql` has been donated by <> and migrated into the monorepo

this allows for quicker iteration cycles, making `vscode-graphql` the official LSP client reference implementation of the graphql ecosystem

### `vscode-graphql-syntax` was split out into it's own extension, and has it's own snapshot suite

Working with the relay LSP project, we decided to make our vscode-compatible TextMate grammars 

## What is in scope for the grant?



## What do you hope to accomplish for the rest of 2024?


