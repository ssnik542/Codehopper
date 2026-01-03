interface ContributionDay {
  contributionCount: number;
  date: string;
  color: string;
}

interface ContributionWeek {
  contributionDays: ContributionDay[];
}

interface ContributionCalendar {
  totalContributions: number;
  weeks: ContributionWeek[];
}

interface ContributionResponse {
  user: {
    contributionsCollection: {
      contributionCalendar: ContributionCalendar;
    };
  };
}
export type { ContributionCalendar, ContributionResponse };
