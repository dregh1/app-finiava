// src/types/habit.ts
export interface Habit {
    id: string;
    description: string;
    startDate: string;
    endDate: string;
    completions: string[];
}

export interface CreateHabitRequest {
    description: string;
    startDate: string;
    endDate: string;
}

export interface CompleteHabitRequest {
    date: string;
}

// export interface HabitStats {
//     id: string;
//     description: string;
//     startDate: string;
//     endDate: string;
//     completions: number;
// }