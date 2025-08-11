import { useState, useEffect, useRef } from "react"
import { SafeAreaView, View, Text, FlatList, TouchableOpacity, Alert } from "react-native"
import AsyncStorage from "@react-native-async-storage/async-storage"
import InventoryItem from "./src/screens/InventoryItem"
import InventoryModal from "./src/screens/InventoryModal"

const App = () => {
  const [inventoryItems, setInventoryItems] = useState([])
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [currentItem, setCurrentItem] = useState(null)
  const [editingItem, setEditingItem] = useState(false)

  const nextId = useRef(0)

  useEffect(() => {
    loadItems()
  }, [])

  useEffect(() => {
    saveItems(inventoryItems)
  }, [inventoryItems])

  const loadItems = async () => {
    try {
      const storedItems = await AsyncStorage.getItem("inventoryItems")
      if (storedItems !== null) {
        const parsedItems = JSON.parse(storedItems)
        setInventoryItems(parsedItems)
        if (parsedItems.length > 0) {
          const maxExistingId = Math.max(...parsedItems.map((item) => Number.parseInt(item.id) || 0))
          nextId.current = maxExistingId + 1
        }
      }
    } catch (error) {
      console.error("Failed to load items from AsyncStorage", error)
    }
  }

  const saveItems = async (items) => {
    try {
      await AsyncStorage.setItem("inventoryItems", JSON.stringify(items))
    } catch (error) {
      console.error("Failed to save items to AsyncStorage", error)
    }
  }

  const handleAddItem = (item) => {
    setInventoryItems((prevItems) => {
      const newItem = { id: (nextId.current++).toString(), ...item }
      return [...prevItems, newItem]
    })
    setIsModalVisible(false)
  }

  const handleEditItem = (updatedItem) => {
    setInventoryItems((prevItems) => prevItems.map((item) => (item.id === updatedItem.id ? updatedItem : item)))
    setIsModalVisible(false)
    setCurrentItem(null)
    setEditingItem(false)
  }

  const handleDeleteItem = (id) => {
    Alert.alert(
      "Delete Item",
      "Are you sure you want to delete this item?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          onPress: () => {
            setInventoryItems((prevItems) => {
              console.log("Previous items (before filter):", prevItems)
              const newItems = prevItems.filter((item) => {
                console.log(`  Comparing item.id: '${item.id}' with target id: '${id}'. Match: ${item.id === id}`)
                return item.id !== id
              })
              console.log("New items (after filter):", newItems)
              return newItems
            })
          },
          style: "destructive",
        },
      ],
      { cancelable: true }
    )
  }

  const openAddModal = () => {
    setCurrentItem(null)
    setEditingItem(false)
    setIsModalVisible(true)
  }

  const openEditModal = (item) => {
    setCurrentItem(item)
    setEditingItem(true)
    setIsModalVisible(true)
  }

  const closeModal = () => {
    setIsModalVisible(false)
    setCurrentItem(null)
    setEditingItem(false)
  }

  const FOOTER_HEIGHT = 80

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: "#f8f8f8" }}>
      <View
        style={{
          flexDirection: "row", justifyContent: "space-between", alignItems: "center",
          padding: 20, borderBottomWidth: 1, borderBottomColor: "#eee", backgroundColor: "#fff"
        }}>
        <Text style={{ fontSize: 24, fontWeight: "bold", color: "#333" }}>
          Inventory Management
        </Text>
      </View>

      {inventoryItems.length === 0
        ? (
          <View
            style={{ flex: 1, justifyContent: "center", alignItems: "center", padding: 20 }}>
            <Text
              style={{ fontSize: 18, color: "#666", textAlign: "center", marginBottom: 10 }}>
              No items in inventory yet.
            </Text>
            <Text
              style={{ fontSize: 18, color: "#666", textAlign: "center", marginBottom: 10 }}>
              Tap "Add New Item" to get started!
            </Text>
          </View>
        ) : (
          <FlatList
            data={inventoryItems}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            renderItem={({ item }) => (
              <InventoryItem
                item={item}
                onEdit={() => openEditModal(item)}
                onDelete={() => handleDeleteItem(item.id)}
              />
            )}
            contentContainerStyle={{ paddingHorizontal: 15, paddingBottom: FOOTER_HEIGHT + 10 }} />
        )}

      <View
        style={{
          position: "absolute", bottom: 0, left: 0, right: 0, backgroundColor: "#fff",
          paddingVertical: 15, paddingHorizontal: 20, alignItems: "center", borderTopWidth: 1,
          borderTopColor: "#eee", height: FOOTER_HEIGHT, justifyContent: "center"
        }}>
        <TouchableOpacity
          onPress={openAddModal}
          style={{
            backgroundColor: "#007bff", paddingVertical: 12, paddingHorizontal: 25,
            borderRadius: 10, width: "100%", alignItems: "center"
          }}>
          <Text
            style={{ color: "#fff", fontSize: 18, fontWeight: "600" }}>
            Add New Item
          </Text>
        </TouchableOpacity>
      </View>

      <InventoryModal
        isVisible={isModalVisible}
        onClose={closeModal}
        onSubmit={editingItem ? handleEditItem : handleAddItem}
        item={currentItem}
      />
    </SafeAreaView>
  )
}

export default App
