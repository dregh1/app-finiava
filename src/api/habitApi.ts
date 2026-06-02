// src/api/habitApi.ts
import { API_URL } from '@env';
import { CreateHabitRequest, Habit } from '../types/habit';

const BASE_URL = API_URL;

export const habitApi = {

    // Récupérer toutes les habitudes
    getAll: async (): Promise<Habit[]> => {
        const response = await fetch(`${BASE_URL}/habits`);
        return response.json();
    },
    getStats: async (period: string): Promise<Habit[]> => {
        const response = await fetch(`${BASE_URL}/habits/stats?period=${period}`);
        return response.json();
    },

    // Créer une habitude
    create: async (habit: CreateHabitRequest): Promise<void> => {
        await fetch(`${BASE_URL}/habits`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(habit),
        });
    },

    // Compléter une habitude
    complete: async (id: string, date: string): Promise<void> => {
        await fetch(`${BASE_URL}/habits/${id}/complete`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ date }),
        });
    },

    // Stats entre deux dates
    getStatsBetween: async (start: string, end: string): Promise<Habit[]> => {
        const response = await fetch(
            `${BASE_URL}/habits/stats/range?start=${start}&end=${end}`
        );
        return response.json();
    },
};
