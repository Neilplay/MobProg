import React, { useState, useEffect } from 'react';
import { View, Text, Button, FlatList, TextInput } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

type PaymentMethod = {
  id: number;
  name: string;
};

export default function AccountManager({ navigation }: { navigation: any }) {
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [newMethod, setNewMethod] = useState<string>('');

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
  };

  const deletePaymentMethod = (id: number) => {
    const updatedMethods = paymentMethods.filter((method) => method.id !== id);
    setPaymentMethods(updatedMethods);
    savePaymentMethods(updatedMethods);
  };

  return (
    <View>
      <TextInput
        placeholder="Enter new payment method"
        value={newMethod}
        onChangeText={setNewMethod}
      />
      <Button title="Add Payment Method" onPress={addPaymentMethod} />
      <FlatList
        data={paymentMethods}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View>
            <Text>{item.name}</Text>
            <Button title="Delete" onPress={() => deletePaymentMethod(item.id)} />
          </View>
        )}
      />
      <Button title="Go to Transactions" onPress={() => navigation.navigate('TransactionScreen')} />
    </View>
  );
}
