import { View, Text, TouchableOpacity } from "react-native"
import Ionicons from "react-native-vector-icons/Ionicons"

export default function InventoryItem({ item, onEdit, onDelete }) {
    return (
        <TouchableOpacity
            onPress={onEdit}
            style={{
                flexDirection: "row", justifyContent: "space-between", alignItems: "center",
                backgroundColor: "#fff", padding: 15, borderRadius: 10, marginVertical: 8,
                shadowColor: "#000", shadowRadius: 3.84, elevation: 5,
                shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1
            }}>
            <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 18, fontWeight: "bold", color: "#333", marginBottom: 5 }}>
                    {item.name}
                </Text>
                <Text style={{ fontSize: 14, color: "#666" }}>
                    Quantity: {item.quantity}
                </Text>
                <Text style={{ fontSize: 14, color: "#666" }}>
                    Price: ${item.price.toFixed(2)}
                </Text>
            </View>
            <TouchableOpacity
                onPress={onDelete}
                style={{ padding: 10 }}>
                <Ionicons
                    name="trash-outline"
                    size={24}
                    color="#dc3545" />
            </TouchableOpacity>
        </TouchableOpacity>
    )
}
