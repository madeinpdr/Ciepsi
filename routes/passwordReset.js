require('dotenv').config();
const mysql   = require('mysql');
const jwt     = require('jsonwebtoken');
const jwtConfig = require('../config/jwt');
const bcrypt  = require('bcryptjs');