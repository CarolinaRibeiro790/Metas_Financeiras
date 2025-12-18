import { useState } from "react";
import { View, Alert } from "react-native";
import { useLocalSearchParams, router } from "expo-router";

import { PageHeader } from "@/components/PageHeader";
import { CurrencyInput } from "@/components/CurrencyInput";
import { Input } from "@/components/Input";
import { Button } from "@/components/Button";
import { TransactionType } from "@/components/TransactionType";
import { TransactionTypes } from "@/utils/TransactionTypes";
import { useTransactionsDatabase } from "@/database/useTransactionsDatabase";

export default function Transaction() {
    const params = useLocalSearchParams<{ id: string }>();
    const transactionDatabase = useTransactionsDatabase();

    const [type, setType] = useState(TransactionTypes.Input);
    const [amount, setAmount] = useState<number | null>(0);

    const [observation, setObservation] = useState("");

    const [isCreating, setIsCreating] = useState(false);

    async function handleCreate() {
        try {
            if (!amount || amount <= 0) {
                return Alert.alert("Atenção", "Preencha o valor. A transação deve ser maior que 0");
            }

            setIsCreating(true);

            await transactionDatabase.create({
                target_id: Number(params.id),
                amount: type === TransactionTypes.Output ? Number(amount) * -1 : Number(amount),
                observation
            });

            Alert.alert("Sucesso", "Transação salva com sucesso!", [
                { text: "Ok", onPress: () => router.back() }

            ])

        } catch (error) {
            Alert.alert("Erro", "Não foi possível salvar a transação.");
            console.log(error);
            setIsCreating(false);
        }
    }

    return (
        <View style={{ flex: 1, padding: 24 }}>
            <PageHeader
                title="Nova transação"
                subtitle="A cada valor guardado você fica mais próximo da sua meta. Se esforce para guardar e evitar retirar."
            />

            <View style={{ marginTop: 32, gap: 24 }}>
                <TransactionType
                    selected={type}
                    onchange={setType}
                />

                <CurrencyInput
                    label="Valor (R$) "
                    value={amount}
                    onChangeValue={(value) => setAmount(value ?? 0)}
                />

                <Input
                    label="Motivo (opcional)"
                    placeholder="Ex: Investir em CDB de 110% no banco XPTO"
                    onChangeText={setObservation}
                />

                <Button
                    title="Salvar"
                    onPress={handleCreate}
                    isProcessing={isCreating}
                />
            </View>
        </View>
    )
}