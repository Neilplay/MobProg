import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TextInput,
  Modal,
  StyleSheet,
  TouchableOpacity,
  Button,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

type PaymentMethod = {
  id: number;
  name: string;
  funds: number;
};

export default function AccountManager({ navigation }: { navigation: any }) {
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [newMethod, setNewMethod] = useState<string>('');
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [fundModalVisible, setFundModalVisible] = useState<boolean>(false);
  const [confirmModalVisible, setConfirmModalVisible] = useState<boolean>(false);
  const [isUpdating, setIsUpdating] = useState<boolean>(false);
  const [currentMethodId, setCurrentMethodId] = useState<number | null>(null);
  const [fundsToAdd, setFundsToAdd] = useState<string>('');
  const [confirmAction, setConfirmAction] = useState<() => void>(() => { });

  useEffect(() => {
    loadPaymentMethods();
  }, []);

  const loadPaymentMethods = async () => {
    const savedMethods = await AsyncStorage.getItem('paymentMethods');
    if (savedMethods) {
      const parsedMethods = JSON.parse(savedMethods).map((method: PaymentMethod) => ({
        ...method,
        funds: method.funds ?? 0,
      }));
      setPaymentMethods(parsedMethods);
    }
  };

  const savePaymentMethods = async (methods: PaymentMethod[]) => {
    await AsyncStorage.setItem('paymentMethods', JSON.stringify(methods));
  };

  const confirmAndExecute = (action: () => void) => {
    setConfirmAction(() => action);
    setConfirmModalVisible(true);
  };

  const executeConfirmedAction = () => {
    confirmAction();
    setConfirmModalVisible(false);
  };

  const addPaymentMethod = () => {
    const updatedMethods = [
      ...paymentMethods,
      { id: Date.now(), name: newMethod, funds: 0 },
    ];
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

  const openAddFundsModal = (id: number) => {
    setCurrentMethodId(id);
    setFundModalVisible(true);
  };

  const addFundsToMethod = async () => {
    const updatedMethods = paymentMethods.map((method) =>
      method.id === currentMethodId
        ? { ...method, funds: method.funds + parseFloat(fundsToAdd || '0') }
        : method
    );
    setPaymentMethods(updatedMethods);
    savePaymentMethods(updatedMethods);

    const methodName = paymentMethods.find((method) => method.id === currentMethodId)
      ?.name;

    if (methodName) {
      await logTransaction(methodName, parseFloat(fundsToAdd || '0'));
    }

    setFundsToAdd('');
    setFundModalVisible(false);
    setCurrentMethodId(null);
  };

  const logTransaction = async (methodName: string, amount: number) => {
    const newTransaction = {
      id: Date.now(),
      methodName,
      amount,
      date: new Date().toLocaleString(),
    };

    const savedTransactions = await AsyncStorage.getItem('transactions');
    const transactions = savedTransactions ? JSON.parse(savedTransactions) : [];
    transactions.push(newTransaction);
    await AsyncStorage.setItem('transactions', JSON.stringify(transactions));
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

      <TouchableOpacity
        style={styles.addButton}
        onPress={() => setModalVisible(true)}
      >
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
                onPress={() => confirmAndExecute(() => openAddFundsModal(item.id))}
              >
                <Text style={styles.addFundsText}>+</Text>
              </TouchableOpacity>
              <Button
                title="Update"
                onPress={() => confirmAndExecute(() => openUpdateModal(item))}
              />
              <Button
                title="Delete"
                onPress={() => confirmAndExecute(() => deletePaymentMethod(item.id))}
              />
            </View>
          </View>
        )}
      />

      <Modal visible={confirmModalVisible} animationType="slide" transparent={true}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text>Are you sure you want to proceed?</Text>
            <View style={styles.modalButtons}>
              <Button title="Yes" onPress={executeConfirmedAction} />
              <Button title="Cancel" onPress={() => setConfirmModalVisible(false)} />
            </View>
          </View>
        </View>
      </Modal>

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
                <Button title="Update" onPress={() => confirmAndExecute(updatePaymentMethod)} />
              ) : (
                <Button title="Add" onPress={() => confirmAndExecute(addPaymentMethod)} />
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
              <Button title="Add Funds" onPress={() => confirmAndExecute(addFundsToMethod)} />
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
  container: { flex: 1, padding: 20, backgroundColor: '#f9f9f9' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
  paymentMethod: {
    padding: 15,
    backgroundColor: '#fff',
    borderRadius: 5,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  methodDetails: { flex: 1 },
  paymentMethodText: { fontSize: 18 },
  fundsText: { fontSize: 16, color: 'gray' },
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
  addFundsText: { color: '#fff', fontWeight: 'bold', fontSize: 18 },
  addButton: {
    backgroundColor: '#007BFF',
    padding: 10,
    borderRadius: 5,
    marginBottom: 20,
    alignItems: 'center',
  },
  addButtonText: { color: '#fff', fontSize: 16 },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: { width: '80%', padding: 20, backgroundColor: '#fff', borderRadius: 10 },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  modalButtons: { flexDirection: 'row', justifyContent: 'space-between' },
});
