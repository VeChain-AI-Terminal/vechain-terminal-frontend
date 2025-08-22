// import fs from "fs";
// import path from "path";
// import yaml from "js-yaml";
import $RefParser from "@apidevtools/json-schema-ref-parser";

// // Load from local YAML file
// export async function loadOpenAPI(filePath: string) {
//   const fileContents = fs.readFileSync(path.resolve(filePath), "utf8");
//   const openapiData = yaml.load(fileContents);
//   return await $RefParser.dereference(openapiData as object);
// }

// Load from already-parsed JSON
export async function loadOpenAPIFromJson(json: any) {
  return await $RefParser.dereference(json);
}

// Return just a list of all path URLs
export async function getAllPathsUrl(openapiData: any): Promise<string[]> {
  return Object.keys(openapiData.paths || {});
}

// Return a list of all paths and their summaries as JSON string
export async function getAllPaths(openapiData: any) {
  return JSON.stringify(
    Object.entries(openapiData.paths || {}).map(
      ([path, methods]: [string, any]) => {
        const firstMethod = Object.keys(methods)[0];
        const summary = methods[firstMethod]?.summary || "No summary available";
        return { path, summary };
      }
    )
  );
}

// Same as getAllPaths (keeping for compatibility)
export async function getAllPathsAndSummary(openapiData: any) {
  return JSON.stringify(
    Object.entries(openapiData.paths || {}).map(
      ([path, methods]: [string, any]) => {
        const firstMethod = Object.keys(methods)[0];
        const summary = methods[firstMethod]?.summary || "No summary available";
        return { path, summary };
      }
    )
  );
}

// Return list of all paths and their descriptions (use summary if available)
export async function getAllPathsAndDesc(openapiData: any) {
  return JSON.stringify(
    Object.entries(openapiData.paths || {})
      .filter(([_, methods]: [string, any]) => !methods.post) // Skip POSTs if needed
      .map(([path, methods]: [string, any]) => {
        const availableMethods = Object.keys(methods).filter(
          (m) => m.toLowerCase() !== "post"
        );
        const firstMethod = availableMethods[0];
        const desc =
          methods[firstMethod]?.description ||
          methods[firstMethod]?.summary ||
          "No desc available";
        return { path, desc };
      })
  );
}

// Return detailed info for every path
export async function getAllPathDetails(openapiData: any) {
  const pathDetailsPromises = Object.entries(openapiData.paths || {}).map(
    async ([path]) => {
      const t = await getPathDetails(openapiData, path);
      return { path, details: t };
    }
  );

  return Promise.all(pathDetailsPromises);
}

export interface PathParameter {
  name: string;
  in: string; // "path" | "query" | "header" | etc.
  required: boolean;
  description: string;
  schema: Record<string, any>;
}

export interface PathDetail {
  method: string; // "GET" | "POST" | "PUT" | etc.
  description: string;
  parameters: PathParameter[];
  baseUrl: string;
  path: string;
}

// Get details for a specific path
export async function getPathDetails(
  openapiData: any,
  pathUrl: string
): Promise<PathDetail[]> {
  const pathObj = openapiData.paths?.[pathUrl];
  if (!pathObj) {
    throw new Error(`Path '${pathUrl}' not found in the OpenAPI spec.`);
  }

  const details: PathDetail[] = Object.entries(pathObj).map(
    ([method, methodDetails]: [string, any]) => {
      const description =
        methodDetails?.description ||
        methodDetails?.summary ||
        "No description available";

      // Collect parameters
      const parameters: PathParameter[] = (methodDetails.parameters || []).map(
        (param: any) => ({
          name: param.name,
          in: param.in,
          required: param.required || false,
          description: param.description || "",
          schema: param.schema || {},
        })
      );

      const mainServerUrl = openapiData.servers?.[0]?.url;
      const servers = methodDetails?.servers || [];
      const serverUrl = servers[0]?.url || mainServerUrl || "";

      return {
        method: method.toUpperCase(),
        description,
        parameters,
        baseUrl: serverUrl,
        path: pathUrl,
      };
    }
  );

  return details;
}

// Return info of a given path without responses (cleaned)
export async function getPathInfo(openapiData: any, path: string) {
  const pathInfo = { ...openapiData.paths?.[path] };
  if (pathInfo) {
    for (const method of Object.keys(pathInfo)) {
      if (typeof pathInfo[method] === "object") {
        delete pathInfo[method].responses; // responses are too verbose
      }
    }
  }
  return { path: pathInfo };
}
