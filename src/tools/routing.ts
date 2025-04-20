export const routingTool = {
  type: 'function',
  function: {
    name: "route",
    description: "Routes a task to the best worker with the right next step.",
    parameters: {
      type: "object",
      properties: {
        worker_id: { type: "string", description: "ID of the selected worker" },
        next_step: { type: "string", description: "Next action to perform" },
        reason: { type: "string", description: "Reasoning for selection" }
      },
      required: ["worker_id", "next_step"]
    }
  }
};
