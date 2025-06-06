import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { CallToolResult } from "@modelcontextprotocol/sdk/types.js";
import {
  startAccessibilityScan,
  AccessibilityScanResponse,
} from "./accessiblity-utils/accessibility";

async function runAccessibilityScan(
  name: string,
  pageURL: string,
): Promise<CallToolResult> {
  try {
    const response: AccessibilityScanResponse = await startAccessibilityScan(
      name,
      [pageURL],
    );
    const scanId = response.data?.id;
    const scanRunId = response.data?.scanRunId;

    if (!scanId || !scanRunId) {
      throw new Error(
        "Unable to start a accessibility scan, please try again later or open an issue on GitHub if the problem persists",
      );
    }

    return {
      content: [
        {
          type: "text",
          text: `Successfully queued accessibility scan, you will get a report via email within 5 minutes.`,
        },
      ],
    };
  } catch (error) {
    return {
      content: [
        {
          type: "text",
          text: `Failed to start accessibility scan: ${error instanceof Error ? error.message : "Unknown error"}. Please open an issue on GitHub if the problem persists`,
          isError: true,
        },
      ],
      isError: true,
    };
  }
}

export default function addAccessibilityTools(server: McpServer) {
  server.tool(
    "startAccessibilityScan",
    "Use this tool to start an accessibility scan for a list of URLs on BrowserStack.",
    {
      name: z.string().describe("Name of the accessibility scan"),
      pageURL: z.string().describe("The URL to scan for accessibility issues"),
    },
    async (args) => {
      return runAccessibilityScan(args.name, args.pageURL);
    },
  );
}
