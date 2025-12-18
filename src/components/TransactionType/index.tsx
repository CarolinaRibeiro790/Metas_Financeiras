import { View } from "react-native";
import { styles } from "./styles";
import { colors } from "@/theme";

import { Option } from "./option";

import { TransactionTypes } from "@/utils/TransactionTypes";

type Props = {
    selected: TransactionTypes
    onchange: (type: TransactionTypes) => void
}

export function TransactionType({ selected, onchange }: Props) {
    return (
        <View style={styles.container}>
            <Option
                icon="arrow-upward"
                title="Guardar"
                isSelected={selected === TransactionTypes.Input}
                selectedColor={colors.blue[500]}
                onPress={() => onchange(TransactionTypes.Input)}
            />

            <Option
                icon="arrow-downward"
                title="Resgatar"
                isSelected={selected === TransactionTypes.Output}
                selectedColor={colors.red[400]}
                onPress={() => onchange(TransactionTypes.Output)}
            />
        </View>
    )
}