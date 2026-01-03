"use client";

import { useQuery } from "@tanstack/react-query";
import {
  getAnalyticsKPIs,
  getReviewsOverTime,
  getReviewStatusStats,
  getRepoUsageStats,
  getMonthlySummary,
} from "./actions";

export const useAnalyticsKPIs = () =>
  useQuery({
    queryKey: ["analytics-kpis"],
    queryFn: getAnalyticsKPIs,
  });

export const useReviewsOverTime = () =>
  useQuery({
    queryKey: ["reviews-over-time"],
    queryFn: getReviewsOverTime,
  });

export const useReviewStatusStats = () =>
  useQuery({
    queryKey: ["review-status"],
    queryFn: getReviewStatusStats,
  });

export const useRepoUsageStats = () =>
  useQuery({
    queryKey: ["repo-usage"],
    queryFn: getRepoUsageStats,
  });

export const useMonthlySummary = () =>
  useQuery({
    queryKey: ["monthly-summary"],
    queryFn: getMonthlySummary,
  });
