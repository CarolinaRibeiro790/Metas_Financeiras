import { useSQLiteContext } from "expo-sqlite";

export type TransactionCreate = {
    target_id: number,
    amount: number,
    observation?: string
}

export type TransactionResponse = {
    id: number,
    target_id: number,
    amount: number,
    observation: string,
    created_at: Date,
    update_at: Date
}

export type Summary = {
    input: number
    output: number
}

export function useTransactionsDatabase() {
    const database = useSQLiteContext()

    async function create(data: TransactionCreate) {
        const statement = await database.prepareAsync(`
            INSERT INTO transactions (target_id, amount, observation)
            VALUES ($target_id, $amount, $observation)
        `);

        try {
            await statement.executeAsync({
                $target_id: Number(data.target_id),
                $amount: Number(data.amount),
                $observation: data.observation ?? null,
            });
        } finally {
            await statement.finalizeAsync();
        }
    }

    function listByTargetId(id: number) {
        return database.getAllAsync<TransactionResponse>(`
            SELECT 
                id, target_id, amount, observation, created_at, update_at
            FROM transactions
            WHERE target_id = ${id}
            ORDER BY created_at DESC
        `)
    }

    async function remove(id: number) {
        await database.runAsync("DELETE FROM transactions WHERE id = ? ", id)
    }

    function summary() {
        return database.getFirstAsync<Summary>(`
            SELECT 
            COALESCE(SUM(CASE WHEN amount > 0 THEN amount ELSE 0 END ), 0) AS input,
            COALESCE(SUM(CASE WHEN amount < 0 THEN amount ELSE 0 END ), 0) AS output
            FROM transactions
        `)
    }

    return {
        create,
        remove,
        summary,
        listByTargetId
    }
}