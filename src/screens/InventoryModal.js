import { useState, useEffect } from "react"
import {
    Modal, View, Text, TextInput, TouchableOpacity, Alert,
    KeyboardAvoidingView, Platform, ScrollView
} from "react-native"

export default function InventoryModal({ isVisible, onClose, onSubmit, item }) {
    const [itemName, setItemName] = useState("")
    const [itemQuantity, setItemQuantity] = useState("")
    const [itemPrice, setItemPrice] = useState("")

    useEffect(() => {
        if (item) {
            setItemName(item.name)
            setItemQuantity(item.quantity.toString())
            setItemPrice(item.price.toString())
        } else {
            setItemName("")
            setItemQuantity("")
            setItemPrice("")
        }
    }, [item, isVisible])

    const handleSubmit = () => {
        if (!itemName.trim()) {
            Alert.alert("Validation Error", "Item Name is required.")
            return
        }
        if (!itemQuantity.trim() || isNaN(Number(itemQuantity)) || Number(itemQuantity) < 0) {
            Alert.alert("Validation Error", "Quantity must be a non-negative number.")
            return
        }
        if (!itemPrice.trim() || isNaN(Number(itemPrice)) || Number(itemPrice) < 0) {
            Alert.alert("Validation Error", "Price must be a non-negative number.")
            return
        }

        const submittedItem = {
            name: itemName.trim(),
            quantity: Number.parseInt(itemQuantity, 10),
            price: Number.parseFloat(itemPrice),
        }

        if (item) {
            submittedItem.id = item.id
        }

        onSubmit(submittedItem)
        onClose()
    }

    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={isVisible}
            onRequestClose={onClose}>

            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={{
                    flex: 1, justifyContent: "center", alignItems: "center",
                    backgroundColor: "rgba(0,0,0,0.5)",
                }}>
                <View
                    style={{
                        width: "90%", maxHeight: "80%", backgroundColor: "white", borderRadius: 20,
                        padding: 25, alignItems: "center", shadowColor: "#000",
                        shadowOpacity: 0.25, shadowRadius: 4, elevation: 5,
                        shadowOffset: { width: 0, height: 2 }
                    }}>
                    <ScrollView
                        contentContainerStyle={{ width: "100%", alignItems: "center" }}>
                        <Text
                            style={{ fontSize: 22, fontWeight: "bold", marginBottom: 20, color: "#333" }}>
                            {item ? "Edit Item" : "Add New Item"}
                        </Text>

                        <Text
                            style={{
                                alignSelf: "flex-start", fontSize: 16, fontWeight: "600",
                                marginBottom: 5, marginTop: 10, color: "#555"
                            }}>
                            Item Name:
                        </Text>
                        <TextInput
                            value={itemName}
                            onChangeText={setItemName}
                            placeholder="Enter item name"
                            style={{
                                width: "100%", height: 50, borderColor: "#ddd", borderWidth: 1,
                                fontSize: 16, borderRadius: 8, paddingHorizontal: 15,
                                marginBottom: 15, backgroundColor: "#f9f9f9"
                            }} />

                        <Text
                            style={{
                                alignSelf: "flex-start", fontSize: 16, fontWeight: "600",
                                marginBottom: 5, marginTop: 10, color: "#555"
                            }} >
                            Quantity:
                        </Text>
                        <TextInput
                            keyboardType="numeric"
                            value={itemQuantity}
                            onChangeText={setItemQuantity}
                            placeholder="Enter quantity"
                            style={{
                                width: "100%", height: 50, borderColor: "#ddd", borderWidth: 1,
                                borderRadius: 8, paddingHorizontal: 15, marginBottom: 15,
                                fontSize: 16, backgroundColor: "#f9f9f9",
                            }} />

                        <Text
                            style={{
                                alignSelf: "flex-start", fontSize: 16, fontWeight: "600",
                                marginBottom: 5, marginTop: 10, color: "#555",
                            }}>
                            Price:
                        </Text>
                        <TextInput
                            keyboardType="numeric"
                            value={itemPrice}
                            onChangeText={setItemPrice}
                            placeholder="Enter price"
                            style={{
                                width: "100%", height: 50, borderColor: "#ddd", borderWidth: 1,
                                borderRadius: 8, paddingHorizontal: 15, marginBottom: 15,
                                fontSize: 16, backgroundColor: "#f9f9f9",
                            }} />

                        <View
                            style={{
                                flexDirection: "row", justifyContent: "space-between",
                                width: "100%", marginTop: 20,
                            }}>
                            <TouchableOpacity
                                onPress={onClose}
                                style={{
                                    backgroundColor: "#6c757d", padding: 15, borderRadius: 10, flex: 1,
                                    marginHorizontal: 5, alignItems: "center"
                                }}>
                                <Text style={{ color: "white", fontSize: 16, fontWeight: "bold" }} >
                                    Cancel
                                </Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                onPress={handleSubmit}
                                style={{
                                    backgroundColor: "#007bff", padding: 15, borderRadius: 10,
                                    flex: 1, marginHorizontal: 5, alignItems: "center"
                                }}>
                                <Text style={{ color: "white", fontSize: 16, fontWeight: "bold" }}>
                                    {item ? "Save Changes" : "Add Item"}
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </ScrollView>
                </View>
            </KeyboardAvoidingView>
        </Modal>
    )
}
