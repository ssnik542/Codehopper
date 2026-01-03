import { serve } from "inngest/next";
import { inngest } from "../../../inngest/client";
import { indexRepo } from "./_functions";
import { generateReview } from "./_functions/review";

// Create an API that serves zero functions
export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [indexRepo, generateReview],
});
