export type LeaderboardEntry = {
  username: string;
  crop: string;
  crop_year: string;
  season: string;
  state: string;
  area: string;
  rainfall: string;
  fertilizer: string;
  pesticide: string;
  predictedYield: number;
  createdAt: string;
  updatedAt: string;
}

export type LeaderboardResponse = {
  entries: LeaderboardEntry[];
  totalPages: number;
}