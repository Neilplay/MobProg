import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, Button } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

type Transaction = {
    id: number;
    methodName: string;
    amount: number;
    date: string;
};

export default function TransactionHistory() {
    const [transactions, setTransactions] = useState<Transaction[]>([]);

    useEffect(() => {
        loadTransactions();
    }, []);

    const loadTransactions = async () => {
        const savedTransactions = await AsyncStorage.getItem('transactions');
        if (savedTransactions) {
            setTransactions(JSON.parse(savedTransactions));
        }
    };

    const addSampleTransaction = async () => {
        const sampleTransaction = {
            id: Date.now(),
            methodName: 'Visa Credit Card',
            amount: 50.75,
            date: new Date().toLocaleString(),
        };

        const updatedTransactions = [...transactions, sampleTransaction];
        setTransactions(updatedTransactions);
        await AsyncStorage.setItem('transactions', JSON.stringify(updatedTransactions));
        console.log('Sample transaction added!');
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Transaction History</Text>

            <Button title="Add Sample Transaction" onPress={addSampleTransaction} />

            {transactions.length === 0 ? (
                <Text style={styles.noTransactions}>No transactions recorded.</Text>
            ) : (
                <FlatList
                    data={transactions}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={({ item }) => (
                        <View style={styles.transactionItem}>
                            <Text style={styles.transactionText}>
                                {item.methodName}: {item.amount > 0 ? '+' : ''}${item.amount.toFixed(2)}
                            </Text>
                            <Text style={styles.transactionDate}>{item.date}</Text>
                        </View>
                    )}
                />
            )}
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
    noTransactions: {
        fontSize: 16,
        color: 'gray',
        textAlign: 'center',
        marginTop: 20,
    },
    transactionItem: {
        padding: 15,
        backgroundColor: '#fff',
        borderRadius: 5,
        marginBottom: 10,
    },
    transactionText: {
        fontSize: 16,
    },
    transactionDate: {
        fontSize: 14,
        color: 'gray',
        marginTop: 5,
    },
});
