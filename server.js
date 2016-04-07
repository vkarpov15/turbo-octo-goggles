'use strict';

const express = require('express');

const app = express();
app.use(express.static('./bin'));
app.listen(3000);
