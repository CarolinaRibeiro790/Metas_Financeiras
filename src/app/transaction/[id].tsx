import { Text, View, Button } from "react-native";
import { useLocalSearchParams, router } from "expo-router";

export default function Transaction() {
    const params = useLocalSearchParams()
    return (
        <View style={{ flex: 1, justifyContent: 'center' }}>
            <Text>ID: {params.id}</Text>

            <Button
                title="Voltar"
                onPress={() => router.back()}
            />
        </View>
    )
}