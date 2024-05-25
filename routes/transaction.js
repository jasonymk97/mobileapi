const express = require('express');
const router = express.Router();
const transactionModel = require('../models/transactionModel');
const Joi = require('joi');

router.post('/', async (req, res) => {
  try {
    const { user_id } = req.userInfo;
    const { date, category_id, type, amount, description } = req.body;

    // validation
    const schema = Joi.object({
      date: Joi.number().required(), 
      category_id: Joi.number().required(),
      type: Joi.string().required(),
      amount: Joi.number().required(),
      description: Joi.string().required().allow(''),
    });

    const validateResult = schema.validate({
      date,
      category_id,
      type,
      amount,
      description
    });

    if (validateResult.error) {
      res.status(400).json({
        error: true,
        message: validateResult.error.details[0].message,
      })
      return;
    }

    const createObj = {
      date, 
      category_id, 
      type, 
      amount, 
      description
    }

    const result = await transactionModel.createTransaction(user_id, createObj);

    res.json({
      error: false,
      message: 'Transaction created'
    });
  } catch (error) {
    res.json({
      error: true,
      message: error
    });
  }
});


router.get('/', async (req, res) => {
  try {
    const { user_id } = req.userInfo;
    const transactions = await transactionModel.getTransactions(user_id);

    res.json({
      error: false,
      data: transactions
    });
  } catch (error) {
    res.json({
      error: true,
      message: error
    });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const id = req.params['id'];

    const txn = await transactionModel.getTransaction(id);

    if (!txn) {
      res.status(404).json({
        error: true,
        message: 'Transaction not found'
      });
      return;
    }

    res.json({
      error: false,
      data: txn
    });
  } catch (error) {
    res.json({
      error: true,
      message: error
    });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const id = req.params['id'];
    const { user_id } = req.userInfo;

    const txn = await transactionModel.getTransaction(id);
    if (!txn) {
      res.status(404).json({
        error: true,
        message: 'Transaction not found'
      });
      return;
    }

    const result = await transactionModel.deleteTransaction(user_id, id);

    res.json({
      error: false,
      message: 'Transaction deleted'
    });
  } catch (error) {
    res.json({
      error: true,
      message: error
    });

  }
});

router.put('/:id', async (req, res) => {
  try {
    const id = req.params['id'];
    const { user_id } = req.userInfo;
    const { date, category_id, type, amount, description } = req.body;

    // validation
    const schema = Joi.object({
      date: Joi.number().required(),
      category_id: Joi.number().required(),
      type: Joi.string().required(),
      amount: Joi.number().required(),
      description: Joi.string().required().allow(''),
    });

    const validateResult = schema.validate({
      date,
      category_id,
      type,
      amount,
      description
    });

    if (validateResult.error) {
      res.status(400).json({
        error: true,
        message: validateResult.error.details[0].message,
      })
      return;
    }

    const updateObj = {
      date,
      category_id,
      type,
      amount,
      description
    }

    const txn = await transactionModel.getTransaction(id);
    if (!txn) {
      res.status(404).json({
        error: true,
        message: 'Transaction not found'
      });
      return;
    }

    const result = await transactionModel.updateTransaction(user_id, id, updateObj)

    res.json({
      error: false,
      message: 'Transaction updated'
    });
  } catch (error) {
    res.json({
      error: true,
      message: error
    });
  }
});


module.exports = router;
