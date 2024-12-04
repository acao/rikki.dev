---
title: "GraphQL Language Service Updates: January 2024"
date: 2024/01/15
description: A detailed look at recent changes to the GraphQL Language Service ecosystem, including new test suites, LSP improvements, and enhanced type system completion
---

The GraphQL Language Service ecosystem has seen significant updates in early 2024, with improvements spanning the core language service, server package, and VSCode extensions. Let's explore the key changes across the ecosystem.

## Comprehensive Test Coverage

A major advancement has been the introduction of comprehensive test suites across the ecosystem:

### Functional Test Suite
- Near end-to-end testing capabilities for everyday workflows
- In-depth integration coverage for the LSP server
- First behavioral testing framework for the ecosystem
- Alternative to VSCode's e2e runner (which had compatibility issues with graphql-config)

### Grammar Test Suite
- New test suite for VSCode syntax highlighting
- Ensures reliable syntax highlighting across different GraphQL constructs
- Improves maintainability of the syntax extension

## LSP Improvements

The Language Server Protocol implementation has received significant enhancements:

### Caching and Performance
- Fixed multiple caching bugs affecting server performance
- Improved handling of config types and loading
- Proper server restart mechanism when config changes occur
- Debounced schema change events to fix codegen issues

### Configuration Handling
- [#3703](https://github.com/graphql/graphiql/pull/3703) standardized the use of `filepath` instead of `filePath` for `graphql-config`
- Enhanced error handling and reporting
- Better integration with graphql-config ecosystem

## graphql-language-service v5.3.0

The core language service package received significant updates focusing on type system completion and streaming support.

### Streaming Support
- [#3715](https://github.com/graphql/graphiql/pull/3715) added support for stream functionality
- Enhanced handling of streaming operations
- Better integration with GraphQL's incremental delivery features

### Type System Completion Improvements

Version 5.2.1 brought crucial fixes to Type System (SDL) completion through [#3521](https://github.com/graphql/graphiql/pull/3521) by [@acao](https://github.com/acao):

```graphql
# Now properly completes object and input type fields
type User {
  # Completion works even when document context isn't detectable
  fi# <- triggers field completion
}

# Better top-level completions for unknown definitions
ty# <- shows all possible type definitions
```

Key improvements include:
- Restored completion for object and input type fields when document context is not detectable or parseable
- Enhanced top-level completions for unknown, type system, or executable definitions
- More accurate mixed top-level completions for unparseable documents
- Maintained `.graphqls` ad-hoc standard functionality while making it optional

## VSCode Extensions

### GraphQL Extension Updates

The VSCode GraphQL extension received several important updates:

- Support for GraphQL v17 incremental delivery response format, contributed by [@yaacovCR](https://github.com/yaacovCR)
- Enhanced configuration handling with standardized filepath usage
- Improved LSP communication stability
- Better integration with the new test suites

### Syntax Extension Improvements

The VSCode GraphQL Syntax extension focuses on reliable syntax highlighting:

- Enhanced syntax highlighting across different GraphQL constructs
- New grammar test suite for better maintainability
- Improved token recognition and highlighting accuracy

## Looking Forward

These updates represent a significant step forward for the GraphQL Language Service ecosystem. The introduction of comprehensive test suites, alongside improvements to LSP functionality and type system completion, demonstrates a commitment to both code quality and developer productivity. The enhanced testing capabilities, in particular, will enable faster debugging and more reliable feature development in the future.

## Resources

- [graphql-language-service Changelog](https://github.com/graphql/graphiql/blob/main/packages/graphql-language-service/CHANGELOG.md)
- [graphql-language-service-server Changelog](https://github.com/graphql/graphiql/blob/main/packages/graphql-language-service-server/CHANGELOG.md)
- [vscode-graphql-syntax Changelog](https://github.com/graphql/graphiql/blob/main/packages/vscode-graphql-syntax/CHANGELOG.md)
- [vscode-graphql Changelog](https://github.com/graphql/graphiql/blob/main/packages/vscode-graphql/CHANGELOG.md)
- [GraphQL Language Service Repository](https://github.com/graphql/graphiql)
