export interface Team {
  id: string;
  name: string;
  category: string;
  vehicle?: string;
  drivers?: string[];
}

export interface PassTime {
  time: number;
  penalty: number;
  total: number;
  timestamp: string;
  manual?: boolean;
  cows?: number;
}

export interface TeamTimes {
  [passNumber: string]: PassTime;
}

export interface Times {
  [teamId: string]: TeamTimes;
}

export interface TeamWithTimes extends Team {
  times: TeamTimes;
  totalTime: number;
  totalPenalty: number;
}
