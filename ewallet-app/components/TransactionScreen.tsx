import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet } from 'react-native';

export default function TransactionScreen({ navigation }: { navigation: any }) {
  const [recipient, setRecipient] = useState<string>('');
  const [amount, setAmount] = useState<string>('');

  const makeTransaction = () => {
    console.log(`Transfer ${amount} to ${recipient}`);
    setRecipient('');
    setAmount('');
  };

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="Recipient"
        value={recipient}
        onChangeText={setRecipient}
        style={styles.input}
      />
      <TextInput
        placeholder="Amount"
        keyboardType="numeric"
        value={amount}
        onChangeText={setAmount}
        style={styles.input}
      />
      <Button title="Transfer Money" onPress={makeTransaction} />
      <Button title="Scan QR" onPress={() => navigation.navigate('QRCodeScanner')} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f9f9f9',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 10,
    borderRadius: 5,
    marginBottom: 20,
  },
});
