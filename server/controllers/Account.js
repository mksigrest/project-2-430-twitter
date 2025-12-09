/* eslint-disable linebreak-style */
/* eslint-disable arrow-body-style */
const bcrypt = require('bcrypt');
const Account = require('../models/Account');

const loginPage = (req, res) => {
  return res.render('login');
};
const logout = (req, res) => {
  req.session.destroy();
  res.redirect('/');
};
const login = (req, res) => {
  const username = `${req.body.username}`;
  const pass = `${req.body.pass}`;

  if (!username || !pass) {
    return res.status(400).json({ error: 'All fields are required' });
  }
  return Account.authenticate(username, pass, (err, account) => {
    if (err || !account) {
      return res.status(401).json({ error: 'Wrong username or password!' });
    }
    req.session.account = Account.toAPI(account);

    return res.json({ redirect: '/maker' });
  });
};
const signup = async (req, res) => {
  const username = `${req.body.username}`;
  const pass = `${req.body.pass}`;
  const pass2 = `${req.body.pass2}`;

  if (!username || !pass || !pass2) {
    return res.status(400).json({ error: 'All fields are required!' });
  }
  if (pass !== pass2) {
    return res.status(400).json({ error: 'Passwords do not match!' });
  }
  try {
    const hash = await Account.generateHash(pass);
    const newAccount = new Account({ username, password: hash });
    await newAccount.save();
    req.session.account = Account.toAPI(newAccount);
    return res.json({ redirect: '/maker' });
  } catch (err) {
    console.log(err);
    if (err.code === 11000) {
      return res.status(400).json({ error: 'Username already in use!' });
    }
    return res.status(500).json({ error: 'An error occured!' });
  }
};
const changePassword = async (req, res) => {
  const curPass = `${req.body.curPass}`;
  const pass = `${req.body.pass}`;
  const pass2 = `${req.body.pass2}`;

  if (!curPass || !pass || !pass2) {
    return res.status(400).json({ error: 'All fields are required!' });
  }
  if (pass !== pass2) {
    return res.status(400).json({ error: 'New passwords do not match' });
  }

  try {
    const account = await Account.findById(req.session.account._id).exec();
    if (!account) {
      return res.status(404).json({ error: 'Account not found' });
    }
    const match = await bcrypt.compare(curPass, account.password);
    if (!match) {
      return res.status(401).json({ error: 'Current password is incorrect' });
    }
    const hash = await Account.generateHash(pass);
    account.password = hash;
    await account.save();

    req.session.account = Account.toAPI(account);
    return res.json({ message: 'Password changed' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Error changing password' });
  }
};
const getAccount = (req, res) => {
  return res.json({ account: req.session.account });
};

module.exports = {
  loginPage,
  login,
  logout,
  signup,
  changePassword,
  getAccount,
};
