import { api } from '../api';

export const getFinanceOverview = async () => {
    try {
        const response = await api.get('/api/finance/dashboard/overview');
        return response.data;
    } catch (error) {
        console.error('Failed to fetch finance dashboard overview:', error);
        throw error;
    }
};
