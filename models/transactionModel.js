const db = require("../config/db");


exports.getTransactions = async (userId) => {
    const transactions = await db.from('transaction').where({ user_id: userId, is_deleted: 0 });
    console.log("🚀 ~ exports.getTransactions= ~ transactions:", transactions)
    return transactions;
}

exports.getTransaction = async (transactionId) => {
    const transaction = await db.from('transaction').where({ id: transactionId }).first();
    return transaction;
}

exports.createTransaction = async (userId, transaction) => {
    const result = await db('transaction').insert({
        create_at: new Date().getTime(),
        updated_at: new Date().getTime(),
        user_id: userId,
        ...transaction
    });

    return result;
}

exports.updateTransaction = async (userId, transactionId, transaction) => {
    const result = await db('transaction').where({ user_id: userId, id: transactionId }).update({
        updated_at: new Date().getTime(),
        ...transaction
    });

    return result;
}

exports.deleteTransaction = async (userId, transactionId) => {
    const result = await db('transaction').where({ user_id: userId, id: transactionId }).update({
        deleted_at: new Date().getTime(),
        is_deleted: 1
    });

    return result;
}
