import React, { useState, useEffect } from 'react';
import { View, Text, Button, FlatList, TextInput, Modal, StyleSheet, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

type PaymentMethod = {
  id: number;
  name: string;
};

export default function AccountManager({ navigation }: { navigation: any }) {
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [newMethod, setNewMethod] = useState<string>('');
  const [modalVisible, setModalVisible] = useState<boolean>(false);

  useEffect(() => {
    loadPaymentMethods();
  }, []);

  const loadPaymentMethods = async () => {
    const savedMethods = await AsyncStorage.getItem('paymentMethods');
    if (savedMethods) {
      setPaymentMethods(JSON.parse(savedMethods));
    }
  };

  const savePaymentMethods = async (methods: PaymentMethod[]) => {
    await AsyncStorage.setItem('paymentMethods', JSON.stringify(methods));
  };

  const addPaymentMethod = () => {
    const updatedMethods = [...paymentMethods, { id: Date.now(), name: newMethod }];
    setPaymentMethods(updatedMethods);
    savePaymentMethods(updatedMethods);
    setNewMethod('');
    setModalVisible(false);
  };

  const deletePaymentMethod = (id: number) => {
    const updatedMethods = paymentMethods.filter((method) => method.id !== id);
    setPaymentMethods(updatedMethods);
    savePaymentMethods(updatedMethods);
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
            <Text style={styles.paymentMethodText}>{item.name}</Text>
            <Button title="Delete" onPress={() => deletePaymentMethod(item.id)} />
          </View>
        )}
      />

      <Button title="Go to Transactions" onPress={() => navigation.navigate('TransactionScreen')} />

      <Modal visible={modalVisible} animationType="slide" transparent={true}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <TextInput
              placeholder="Enter new payment method"
              value={newMethod}
              onChangeText={setNewMethod}
              style={styles.input}
            />
            <View style={styles.modalButtons}>
              <Button title="Add" onPress={addPaymentMethod} />
              <Button title="Cancel" onPress={() => setModalVisible(false)} />
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
  paymentMethodText: {
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
