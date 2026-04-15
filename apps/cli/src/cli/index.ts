// We can use the html rewriter part since Bun supports it
import { HtmlRewriterUmisApiStudentClient } from "@babcock-umis-api/core";
import { program } from "commander";
import packageJson from "../../package.json";

const { description, name, version } = packageJson;

program.name(name).description(description).version(version);
HtmlRewriterUmisApiStudentClient;

export const runCli = program.parseAsync.bind(program);
