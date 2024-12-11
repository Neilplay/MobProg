import React, { useState, useEffect } from 'react';
import { View, Text, Button, FlatList, TextInput, Modal, StyleSheet, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

type PaymentMethod = {
  id: number;
  name: string;
  funds: number; // Added funds property
};

export default function AccountManager({ navigation }: { navigation: any }) {
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [newMethod, setNewMethod] = useState<string>('');
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [fundModalVisible, setFundModalVisible] = useState<boolean>(false);
  const [isUpdating, setIsUpdating] = useState<boolean>(false);
  const [currentMethodId, setCurrentMethodId] = useState<number | null>(null);
  const [fundsToAdd, setFundsToAdd] = useState<string>('');

  useEffect(() => {
    loadPaymentMethods();
  }, []);

  const loadPaymentMethods = async () => {
    const savedMethods = await AsyncStorage.getItem('paymentMethods');
    if (savedMethods) {
      const parsedMethods = JSON.parse(savedMethods).map((method: PaymentMethod) => ({
        ...method,
        funds: method.funds ?? 0, // Ensure funds is not undefined
      }));
      setPaymentMethods(parsedMethods);
    }
  };

  const savePaymentMethods = async (methods: PaymentMethod[]) => {
    await AsyncStorage.setItem('paymentMethods', JSON.stringify(methods));
  };

  const addPaymentMethod = () => {
    const updatedMethods = [...paymentMethods, { id: Date.now(), name: newMethod, funds: 0 }];
    setPaymentMethods(updatedMethods);
    savePaymentMethods(updatedMethods);
    setNewMethod('');
    setModalVisible(false);
  };

  const updatePaymentMethod = () => {
    const updatedMethods = paymentMethods.map((method) =>
      method.id === currentMethodId ? { ...method, name: newMethod } : method
    );
    setPaymentMethods(updatedMethods);
    savePaymentMethods(updatedMethods);
    setNewMethod('');
    setModalVisible(false);
    setIsUpdating(false);
    setCurrentMethodId(null);
  };

  const deletePaymentMethod = (id: number) => {
    const updatedMethods = paymentMethods.filter((method) => method.id !== id);
    setPaymentMethods(updatedMethods);
    savePaymentMethods(updatedMethods);
  };

  const addFundsToMethod = () => {
    const updatedMethods = paymentMethods.map((method) =>
      method.id === currentMethodId
        ? { ...method, funds: method.funds + parseFloat(fundsToAdd || '0') }
        : method
    );
    setPaymentMethods(updatedMethods);
    savePaymentMethods(updatedMethods);
    setFundsToAdd('');
    setFundModalVisible(false);
    setCurrentMethodId(null);
  };

  const openAddFundsModal = (id: number) => {
    setCurrentMethodId(id);
    setFundModalVisible(true);
  };

  const openUpdateModal = (method: PaymentMethod) => {
    setNewMethod(method.name);
    setCurrentMethodId(method.id);
    setIsUpdating(true);
    setModalVisible(true);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Manage Payment Methods</Text>

      <TouchableOpacity style={styles.addButton} onPress={() => setModalVisible(true)}>
        <Text style={styles.addButtonText}>+ Add Payment Method</Text>
      </TouchableOpacity>

      <FlatList
        data={paymentMethods}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.paymentMethod}>
            <View style={styles.methodDetails}>
              <Text style={styles.paymentMethodText}>{item.name}</Text>
              <Text style={styles.fundsText}>Funds: ${item.funds.toFixed(2)}</Text>
            </View>
            <View style={styles.actionButtons}>
              <TouchableOpacity
                style={styles.addFundsButton}
                onPress={() => openAddFundsModal(item.id)}
              >
                <Text style={styles.addFundsText}>+</Text>
              </TouchableOpacity>
              <Button title="Update" onPress={() => openUpdateModal(item)} />
              <Button title="Delete" onPress={() => deletePaymentMethod(item.id)} />
            </View>
          </View>
        )}
      />

      {/* Add or Update Payment Method Modal */}
      <Modal visible={modalVisible} animationType="slide" transparent={true}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <TextInput
              placeholder="Enter payment method"
              value={newMethod}
              onChangeText={setNewMethod}
              style={styles.input}
            />
            <View style={styles.modalButtons}>
              {isUpdating ? (
                <Button title="Update" onPress={updatePaymentMethod} />
              ) : (
                <Button title="Add" onPress={addPaymentMethod} />
              )}
              <Button
                title="Cancel"
                onPress={() => {
                  setModalVisible(false);
                  setIsUpdating(false);
                  setNewMethod('');
                  setCurrentMethodId(null);
                }}
              />
            </View>
          </View>
        </View>
      </Modal>

      {/* Add Funds Modal */}
      <Modal visible={fundModalVisible} animationType="slide" transparent={true}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <TextInput
              placeholder="Enter amount to add"
              value={fundsToAdd}
              onChangeText={setFundsToAdd}
              keyboardType="numeric"
              style={styles.input}
            />
            <View style={styles.modalButtons}>
              <Button title="Add Funds" onPress={addFundsToMethod} />
              <Button
                title="Cancel"
                onPress={() => {
                  setFundModalVisible(false);
                  setFundsToAdd('');
                  setCurrentMethodId(null);
                }}
              />
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f9f9f9',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  paymentMethod: {
    padding: 15,
    backgroundColor: '#fff',
    borderRadius: 5,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  methodDetails: {
    flex: 1,
  },
  paymentMethodText: {
    fontSize: 18,
  },
  fundsText: {
    fontSize: 16,
    color: 'gray',
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  addFundsButton: {
    backgroundColor: '#28a745',
    padding: 10,
    borderRadius: 5,
    marginRight: 10,
  },
  addFundsText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
  },
  addButton: {
    backgroundColor: '#007BFF',
    padding: 10,
    borderRadius: 5,
    marginBottom: 20,
    alignItems: 'center',
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '80%',
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});
