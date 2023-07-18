---
title: Building a JSON Schema-enabled `JSON5` mode for codemirror, monaco and/or graphiql
date: 2023-07-18
description: A `JSON5` mode for `monaco editor` or `codemirror6` that works against JSONSchema definitions like `monaco-json` doesn't exist yet, here are a few recipies for how it could work for `graphiql`!
---

There are **several potential routes** for providing `JSON5` variables support for `monaco-graphql` and `graphiql`, one of which we are already pursuing!

This article is also useful for anyone building json4 or json5 enabled feature modes for any IDE.

## Background

`monaco-graphql` uses a `getVariablesJSONSchema` utility I wrote, that supplies a json schema to `monaco-json` for variables completion. It accepts either an AST or string of the operation, and returns a complete JSON description to validate/hover/autocomplete these input types and other scalars.

This leverages `monaco-json`'s api which allows you to define a set of json schemas for these language features, which utilizes the underlying `vscode-json-languageservice` and their custom `jsonParser`. you have likely seen this in action on codesandbox, or in vscode when defining json configuration files like `package.json` or `tsconfig.json`.

## Key features of a json-schema enabled `JSON4`/`JSON5` mode:

### 1. Continues working when string parse methods fail, such as `JSON5.parse()` or `JSON.parse()`

> *JSON/5 language features are still needed when you have a `SyntaxError`*

We created a utility you can see in the PR below using cm6's syntax tree that still parses and aggregates json pointers and positional data when the string parse fails.

This allows you to get completion, hover, and validation data when typing out `JSON4` or `JSON5` properties, regardless of whether the string is valid. we have similar fault tolerance for `graphql-language-service`'s parser.

This is why you can still use features like completion and hover for operation documents when `graphql.parse()` would fail.

### 2. Hyper-positionally aware

Another reason you can't build full modes with `JSON5.parse()` or `JSON.parse()` than fault tolerance is the lack of positional information. The errors give you a little bit, but not the entire range you need for editor tooling.

`json-source-map` gives positional information, but lacks fault tolerance, unlike the `parseJSONDocument` library we built for codemirror 6, that uses the cm6 syntax tree. This library is often seen along with `ajv` for codemirror6 json schema implementations, but the lack of fault tolerance and the

### 3. Dynamic types aren't needed for `graphql` variables (yet)

For graphql variables at least, it doesn't need to worry about `oneOf`, `anyOf` or other dynamic types in the `json-schema` spec yet. Polymorphic input features for graphql are still in progress.

These would still need to exist for a complete, multi-purpose JSON Schema mode, outside of graphql variables applications.

### 4. Language Feature Complete

it should provide what `monaco-json` provides already for `JSON4`, and thus we already provide via `monaco-graphql` - validation, hover, autocompletion, and formatting

## Proposed approaches:

### CM6 JSON5 Variables Editor Plugin!

[@imolorhe](https://github.com/imolorhe) and I are making a lot of headway on a json (JSON4) json-schema-enabled mode for cm6!

https://github.com/acao/cm6-language-json-schema/pull/2

The cm6 syntax tree is a breeze to work with and very performant, **and would be easy to translate to `JSON5`** using their existing `JSON5` mode (which just calls `JSON5.parse()` and handles validation messages for now, no JSON Schema in scope).

So, as we do with `cm6-language-json-schema` and `@codemirror/lang-json`, we can extend the existing `@codemirror/lang-json5` mode that exists to provide JSON Schema support for json5 using their syntax tree, and then provide a cm6 `JSON5` variables editor as a graphiql plugin in place of the `monaco-json` editor.

There are vscode-style keymaps and other ways cm6 could be extended to have feature parity with our current `monaco-json` implementation.

**this would be used _alongside_ monaco-graphql**. codemirror 6 is extremely lightweight and the display is easily customizeable, and it wouldn't be a problem to use the editor runtimes together, especially via a plugin for overriding the variables editor, or a plugin for providing multiple "variables mode" options.

### Extend `monaco-json` and `vscode-json-languageservice` to Support `JSON5`

The `vscode-json-languageservice` that belies `monaco-json` would need either a seperate `JSON5` parser, or would need to be improved to handle all of the rules of the `JSON5` spec. currently, it uses config options to support (most of) `CSON`, but assumes all property names are double quoted, etc. again, `JSON5.parse()` cannot be used for this because it needs to parse incomplete and invalid documents to be a useful parser for IDE purposes.

This would also be determined by microsoft's willingness to pursue such a goal. It would be very powerful, modernize their ecosystem, and give 80+ percent of developers the ability to use `package.JSON5`, `tsconfig.JSON5`, seamlessly!

### Create a `monaco-json5`?

Someone could also create a new `monaco-json` style-like mode from scratch for `JSON5`. I would look into existing `JSON5` vscode extensions, and other libraries that implement `JSON5` features and validation that have json-schema support, and use this as the underlying implementation. Monaco, unlike codemirror, does not bring it's own parser and syntax tree conventions, so this can be both freeing, and a performance issue.


## Ask Me for Help

I love to help people to develop editor tooling, so ping me! You can find me on the graphql discord server :)

## More Articles Coming Soon:

- how to implement `monaco-graphql` with next.js
- the story of `monaco-graphql`, and how to build your own full-featured, webworker enabled monaco mode, with tips from the vscode team!
- the story of building `cm6-json-schema`, which is unfolding as you read this!
