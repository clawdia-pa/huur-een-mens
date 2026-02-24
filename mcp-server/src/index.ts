#!/usr/bin/env node

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";

// Configuration from environment variables
const API_URL = process.env.HUUR_EEN_MENS_API_URL || "https://huur-een-mens.vercel.app";
const API_TOKEN = process.env.HUUR_EEN_MENS_API_TOKEN || "";

// Helper: make authenticated API requests
async function apiRequest(
  path: string,
  options: RequestInit = {}
): Promise<any> {
  const url = `${API_URL}${path}`;
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string> || {}),
  };

  if (API_TOKEN) {
    headers["Authorization"] = `Bearer ${API_TOKEN}`;
  }

  const response = await fetch(url, { ...options, headers });
  const data = await response.json();

  if (!response.ok || !data.success) {
    throw new Error(data.error || `API request failed: ${response.status}`);
  }

  return data;
}

// Create MCP Server
const server = new McpServer({
  name: "huur-een-mens",
  version: "1.0.0",
});

// ─── Tool 1: search_humans ──────────────────────────────────────────────────

server.registerTool(
  "search_humans",
  {
    title: "Search Humans",
    description:
      "Search for available humans on HuurEenMens. Optionally filter by skill, city, or hourly rate range. Returns a list of humans with their profiles.",
    inputSchema: {
      skill: z
        .string()
        .optional()
        .describe("Filter by skill slug (e.g. 'schoonmaak', 'koerier', 'tuinieren')"),
      city: z
        .string()
        .optional()
        .describe("Filter by city name (e.g. 'Amsterdam', 'Rotterdam')"),
      min_rate: z
        .number()
        .optional()
        .describe("Minimum hourly rate in EUR"),
      max_rate: z
        .number()
        .optional()
        .describe("Maximum hourly rate in EUR"),
    },
  },
  async ({ skill, city, min_rate, max_rate }) => {
    const params = new URLSearchParams();
    if (skill) params.set("skill", skill);
    if (city) params.set("city", city);
    if (min_rate !== undefined) params.set("minRate", String(min_rate));
    if (max_rate !== undefined) params.set("maxRate", String(max_rate));

    const query = params.toString();
    const data = await apiRequest(`/api/users${query ? `?${query}` : ""}`);

    const humans = data.humans || [];
    if (humans.length === 0) {
      return {
        content: [{ type: "text" as const, text: "No humans found matching your criteria." }],
      };
    }

    const summary = humans.map((h: any) =>
      [
        `Name: ${h.name}`,
        `ID: ${h.id}`,
        h.headline ? `Headline: ${h.headline}` : null,
        h.location_city ? `Location: ${h.location_city}${h.location_country ? ', ' + h.location_country : ''}` : null,
        h.hourly_rate ? `Rate: €${h.hourly_rate}/hr` : null,
        h.is_verified ? `Verified: ✓` : null,
        h.skills?.length ? `Skills: ${h.skills.map((s: any) => s.name).join(", ")}` : null,
      ]
        .filter(Boolean)
        .join("\n")
    ).join("\n---\n");

    return {
      content: [{ type: "text" as const, text: `Found ${humans.length} human(s):\n\n${summary}` }],
    };
  }
);

// ─── Tool 2: get_human ──────────────────────────────────────────────────────

server.registerTool(
  "get_human",
  {
    title: "Get Human Profile",
    description:
      "Get the full profile of a specific human by their ID. Returns detailed info including bio, skills, location, and hourly rate.",
    inputSchema: {
      human_id: z.string().describe("The unique ID of the human (e.g. 'user_17718...')"),
    },
  },
  async ({ human_id }) => {
    const data = await apiRequest("/api/users");
    const human = (data.humans || []).find((h: any) => h.id === human_id);

    if (!human) {
      return {
        content: [{ type: "text" as const, text: `Human with ID '${human_id}' not found.` }],
      };
    }

    const profile = [
      `Name: ${human.name}`,
      `ID: ${human.id}`,
      human.headline ? `Headline: ${human.headline}` : null,
      human.bio ? `Bio: ${human.bio}` : null,
      human.location_city ? `Location: ${human.location_city}${human.location_country ? ', ' + human.location_country : ''}` : null,
      human.hourly_rate ? `Hourly Rate: €${human.hourly_rate}` : null,
      human.currency ? `Currency: ${human.currency}` : null,
      `Verified: ${human.is_verified ? 'Yes ✓' : 'No'}`,
      `Available: ${human.is_available ? 'Yes' : 'No'}`,
      human.skills?.length ? `Skills: ${human.skills.map((s: any) => s.name).join(", ")}` : null,
      human.created_at ? `Member since: ${human.created_at}` : null,
    ]
      .filter(Boolean)
      .join("\n");

    return {
      content: [{ type: "text" as const, text: profile }],
    };
  }
);

// ─── Tool 3: list_skills ────────────────────────────────────────────────────

server.registerTool(
  "list_skills",
  {
    title: "List Skills",
    description:
      "List all available skills and categories on HuurEenMens. Use the skill slugs when searching for humans.",
    inputSchema: {},
  },
  async () => {
    const data = await apiRequest("/api/skills");
    const skills = data.skills || [];

    if (skills.length === 0) {
      return {
        content: [{ type: "text" as const, text: "No skills found." }],
      };
    }

    // Group by category
    const grouped: Record<string, string[]> = {};
    for (const skill of skills) {
      const cat = skill.category || "Overig";
      if (!grouped[cat]) grouped[cat] = [];
      grouped[cat].push(`${skill.name} (slug: ${skill.slug})`);
    }

    const text = Object.entries(grouped)
      .map(([cat, items]) => `${cat}:\n${items.map(i => `  • ${i}`).join("\n")}`)
      .join("\n\n");

    return {
      content: [{ type: "text" as const, text: `Available skills:\n\n${text}` }],
    };
  }
);

// ─── Tool 4: book_human ─────────────────────────────────────────────────────

server.registerTool(
  "book_human",
  {
    title: "Book a Human",
    description:
      "Book a human for a physical task. Requires authentication (API token). You must provide the human's ID, a task description, location, date, and time.",
    inputSchema: {
      human_id: z.string().describe("The ID of the human to book"),
      task_description: z.string().describe("Description of the task to be performed"),
      task_location: z.string().describe("Location where the task should be performed"),
      task_date: z.string().describe("Date for the task (YYYY-MM-DD format)"),
      task_time: z.string().describe("Time for the task (HH:MM format)"),
      duration_hours: z
        .number()
        .min(1)
        .optional()
        .describe("Duration in hours (default: 1)"),
      notes: z
        .string()
        .optional()
        .describe("Additional notes for the human"),
    },
  },
  async ({ human_id, task_description, task_location, task_date, task_time, duration_hours, notes }) => {
    if (!API_TOKEN) {
      return {
        content: [{
          type: "text" as const,
          text: "Error: No API token configured. Set the HUUR_EEN_MENS_API_TOKEN environment variable with a valid JWT token to book humans.",
        }],
      };
    }

    const data = await apiRequest("/api/bookings", {
      method: "POST",
      body: JSON.stringify({
        human_id,
        task_description,
        task_location,
        task_date,
        task_time,
        duration_hours: duration_hours || 1,
        notes: notes || "",
      }),
    });

    const b = data.booking;
    const summary = [
      `Booking confirmed!`,
      ``,
      `Booking ID: ${b.id}`,
      `Human: ${b.human_id}`,
      `Task: ${b.task_description}`,
      `Location: ${b.task_location}`,
      `Date: ${b.task_date} at ${b.task_time}`,
      `Duration: ${b.duration_hours} hour(s)`,
      `Total Price: €${b.total_price}`,
      `Status: ${b.status}`,
      b.notes ? `Notes: ${b.notes}` : null,
    ]
      .filter(Boolean)
      .join("\n");

    return {
      content: [{ type: "text" as const, text: summary }],
    };
  }
);

// ─── Tool 5: get_bookings ───────────────────────────────────────────────────

server.registerTool(
  "get_bookings",
  {
    title: "Get Bookings",
    description:
      "List all bookings for the authenticated user. Optionally filter by status (pending, confirmed, completed, cancelled).",
    inputSchema: {
      status: z
        .enum(["pending", "confirmed", "completed", "cancelled"])
        .optional()
        .describe("Filter by booking status"),
    },
  },
  async ({ status }) => {
    if (!API_TOKEN) {
      return {
        content: [{
          type: "text" as const,
          text: "Error: No API token configured. Set the HUUR_EEN_MENS_API_TOKEN environment variable.",
        }],
      };
    }

    const params = status ? `?status=${status}` : "";
    const data = await apiRequest(`/api/bookings${params}`);
    const bookings = data.bookings || [];

    if (bookings.length === 0) {
      return {
        content: [{ type: "text" as const, text: status ? `No ${status} bookings found.` : "No bookings found." }],
      };
    }

    const summary = bookings.map((b: any) =>
      [
        `Booking ID: ${b.id}`,
        `Human: ${b.human_name || b.human_id}`,
        b.agent_name ? `Agent: ${b.agent_name}` : null,
        `Task: ${b.task_description}`,
        `Location: ${b.task_location}`,
        `Date: ${b.task_date} at ${b.task_time}`,
        `Duration: ${b.duration_hours}h`,
        `Price: €${b.total_price}`,
        `Status: ${b.status}`,
      ]
        .filter(Boolean)
        .join("\n")
    ).join("\n---\n");

    return {
      content: [{ type: "text" as const, text: `Found ${bookings.length} booking(s):\n\n${summary}` }],
    };
  }
);

// ─── Tool 6: update_booking ─────────────────────────────────────────────────

server.registerTool(
  "update_booking",
  {
    title: "Update Booking",
    description:
      "Update the status of a booking. Can be used to confirm, complete, or cancel a booking.",
    inputSchema: {
      booking_id: z.string().describe("The ID of the booking to update"),
      status: z
        .enum(["confirmed", "completed", "cancelled"])
        .describe("The new status for the booking"),
    },
  },
  async ({ booking_id, status }) => {
    if (!API_TOKEN) {
      return {
        content: [{
          type: "text" as const,
          text: "Error: No API token configured. Set the HUUR_EEN_MENS_API_TOKEN environment variable.",
        }],
      };
    }

    const data = await apiRequest("/api/bookings", {
      method: "PATCH",
      body: JSON.stringify({ booking_id, status }),
    });

    const b = data.booking;
    return {
      content: [{
        type: "text" as const,
        text: `Booking ${b.id} updated to status: ${b.status}`,
      }],
    };
  }
);

// ─── Start server ───────────────────────────────────────────────────────────

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("HuurEenMens MCP Server running on stdio");
}

main().catch((error) => {
  console.error("Fatal error:", error);
  process.exit(1);
});
