import React, { useState } from 'react';
import { View, TextInput, Button } from 'react-native';

export default function TransactionScreen({ navigation }: { navigation: any }) {
  const [recipient, setRecipient] = useState<string>('');
  const [amount, setAmount] = useState<string>('');

  const makeTransaction = () => {
    // Perform transaction logic (here we just log it)
    console.log(`Transfer ${amount} to ${recipient}`);
    setRecipient('');
    setAmount('');
  };

  return (
    <View>
      <TextInput
        placeholder="Recipient"
        value={recipient}
        onChangeText={setRecipient}
      />
      <TextInput
        placeholder="Amount"
        keyboardType="numeric"
        value={amount}
        onChangeText={setAmount}
      />
      <Button title="Transfer Money" onPress={makeTransaction} />
      <Button title="Scan QR" onPress={() => navigation.navigate('QRCodeScanner')} />
    </View>
  );
}
