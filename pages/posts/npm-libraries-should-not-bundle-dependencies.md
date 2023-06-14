---
title: NPM Libraries With Bundled Dependencies are a supply chain risk (and more)
date: 2023-06-14
---

Some years ago, vite library mode and other bundling tools revolutionized the experience of shipping javascript & typescript modules for the browser. An unfortunate consequence, however, is that many libraries began shipping bundled with their dependencies.

Vite library mode and esbuild with bundle: true are great for shipping CDN bundle libraries (say for usage on unpkg, jsdelivr, etc), where shipping with dependencies is a desired feature. However, for esm modules on npm or other javascript package registries, this results in false postivies regarding dependencies, and thus everything from supply chain vulnerabilities to.

## False Positives for (most) Static Security Analysis Tools!

Starting with this because supply chain security comes before everything - shipping your library with bundled dependencies introduces huge potential for supply chain vulnerabilities. Unless you ship releases almost daily, by statically bundling versions, your users are always going to be essentially pinned to the installed version from your last release, and any security hotfixes upstream will be missed... but simple static analysis tools such as npm audit or similar will not be able to pick this up!

This is because your package manager (npm, pnpm, yarn, etc) will _think_ it's installing the patched version if there are ~ or ^ in the library's dependencies, but you are getting the wrong one.

### Hypothetical Toolchain Vulnerability Example

Last month we shipped the ever popular `zebra` module, which depends on a module called `albatross`.

`zebra`'s `package.json` looks like this:

```json
{
    "name": "zebra",
    "version": "0.1",
    "dependencies": {
        "albatross": "^1.1.0"
    }
}

```

however, last week, `albatross` project was contacted by Cure 53, who found an XSS attack vulnerability. `albatross` released a security patch as `albatross@1.1.1` 

However, the maintainer of `zebra` hasn't learned of this because she is on a much needed vacation. 

Her colleauges have learned of this vulnerability on 0 day, when renovatebot or dependabot or snyk or an npm install audit tells them that their lockfile contains vulnerabilities. They quickly re-release their internal software with a resolution for `albatross@1.1.1`. problem solved, right? 

**Unfortunately not.**

The maintainer of `zebra` is using `esbuild` with `bundle: true` to ship her module, and didn't think of this case (neither did I when we first shipped `@graphiql/react`!)

What does this mean? Let's look at this using the old `node_modules` pattern because it's easier to illustrate, though this would impact pnp users as well.

```text
./node_modules/
   /albatross/ <- albatross@1.1.1 is installed, but unused
   /zebra/ <- still bundled with & loading albatross@1.1.0 at runtime
```

This is an issue a dynamic security scan would catch, and perhaps more sophisticated static analysis tools, but most of the common off-the-shelf and freely available static analysis tools cannot.

And it is not a problem to be solved by security analysis tools, which should serve as a stopgap, because toolchain and maintainer best practices should be the first line of defense, and toolchain security is not the only reason this is an issue.

## 2. The Debugging/Sourcemaps Experience is **Whack**

Did you also notice this about two years ago? Suddenly it was much harder to trace buildtime (ts) and runtime bugs with dependencies because the code is entirely inlined?

First of all, modules can ship with their source and sourcemaps to help make this a little easier. Whether they should or not is a whole discussion


## How maintainers can solve this problem

for `esbuild`: set `bundle: false`

for vite library mode, you can use [a plugin like this](https://socket.dev/npm/package/vite-plugin-no-bundle)
