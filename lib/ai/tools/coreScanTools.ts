import { tool } from "ai";
import { z } from "zod";
import {
  getPathDetails,
  loadOpenAPIFromJson,
  PathDetail,
} from "@/lib/utils/openapi";
import coreDaoMainnetOpenapiSpec from "@/lib/utils/coreDaoMainnetOpenapiSpec.json";

/**
 * Tool 1: Get Path Parameters and Base URL
 * Input: API path (e.g. '/api/accounts/core_balance_by_address/{address}')
 * Output: Object describing required parameters and metadata (without apikey requirement).
 */
export const getCoreScanApiParams = tool({
  description:
    "Retrieve required parameters and metadata for a given CoreScan API path. Input is the API path (e.g. '/api/accounts/core_balance_by_address/{address}'). Output includes required path/query parameters.",
  inputSchema: z.object({
    path: z.string().describe("The API path to inspect."),
  }),
  execute: async ({ path }): Promise<PathDetail[]> => {
    console.log("Fetching parameters for path:", path);

    const coreOpenapiData = await loadOpenAPIFromJson(
      coreDaoMainnetOpenapiSpec
    );

    let pathDetails: PathDetail[] = await getPathDetails(coreOpenapiData, path);

    // Strip out the apikey param if present
    pathDetails = pathDetails.map((detail) => ({
      ...detail,
      parameters: detail.parameters.filter(
        (p) => !(p?.name?.toLowerCase() === "apikey" && p?.in === "query")
      ),
    }));

    console.log("Cleaned path details ---", pathDetails);
    console.log(
      "Cleaned pathDetails[0].parameters ---",
      pathDetails[0].parameters
    );
    return pathDetails;
  },
});

/**
 * Tool 2: Make CoreScan API Call
 * Input: Full URL (already formed by the agent, except missing the API key).
 * Output: JSON response from CoreScan API.
 */
export const makeCoreScanApiCall = tool({
  description:
    "Make a real-time API call to the CoreScan endpoint. Input is the full URL.",
  inputSchema: z.object({
    fullUrl: z
      .string()
      .describe("The complete URL for the CoreScan API endpoint."),
  }),
  execute: async ({ fullUrl }) => {
    console.log("Executing CoreScan API call to:", fullUrl);
    try {
      const apiKey = process.env.CORE_SCAN_API_KEY;
      if (!apiKey) {
        throw new Error("CoreScan API key not found");
      }

      const separator = fullUrl.includes("?") ? "&" : "?";
      const urlWithKey = `${fullUrl}${separator}apikey=${apiKey}`;
      console.log("url with key --- ", urlWithKey);

      const response = await fetch(urlWithKey, {
        method: "GET",
        headers: { accept: "application/json" },
      });

      if (!response.ok) {
        throw new Error(`API call failed with status ${response.status}`);
      }

      const json = await response.json();
      console.log("Fetched CoreScan API response:", json);
      return json;
    } catch (error) {
      console.error("Error in makeCoreScanApiCall:", error);
      return { error: "Failed to fetch data from CoreScan API." };
    }
  },
});
