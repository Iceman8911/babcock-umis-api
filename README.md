# babcock-umis-api

This repository is a monorepo containing a javascript library that reverse-engineers a developer-friendly api from umis.bacbcock.edu.ng. For educational purposes, of course.

The folder structure follows:

- apps/api -> A self-hostable Elysia server, published by default to Cloudflare Workers.
- apps/cli -> A runtime-agnostic package that can be run on any Linux, Windows, or MacOS machine.
- apps/docs -> An Astro + Starlight documentation site.
- packages/core -> All the reverse-engineered functions that other apps and packages depend on.
- packages/core-public -> A cleaner API surface of the core package for npm publishing.
- packages/shared -> Reusable helpers
