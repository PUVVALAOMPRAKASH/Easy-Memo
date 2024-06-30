require("dotenv").config();
const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const Product = require('./models/product');
const methodOverride = require('method-override');
const app = express();

const mongoOptions = {
    useNewUrlParser: true,
    useUnifiedTopology: true
};

mongoose.connect(process.env.MONGO_URI, mongoOptions)
    .then(() => {
        app.listen(3000, () => {
            console.log("APP IS LISTENING ON PORT 3000!");
        });
    })
    .catch(err => {
        console.log("OH NO MONGO CONNECTION ERROR!!!!");
        console.log(err);
    });

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(express.static(__dirname + "/public"));

// Update routes from /products to /memo
app.get('/', async (req, res) => {
    const { title } = req.query;
    if (title) {
        const products = await Product.find({ title });
        res.render('products/index', { products, title });
    } else {
        const products = await Product.find({});
        res.render('products/index', { products });
    }
});

app.get('/memo', async (req, res) => {
    const { title } = req.query;
    if (title) {
        const products = await Product.find({ title });
        res.render('products/index', { products, title });
    } else {
        const products = await Product.find({});
        res.render('products/index', { products });
    }
});

app.get('/memo/new', (req, res) => {
    res.render('products/new');
});

app.post('/memo', async (req, res) => {
    const newProduct = new Product(req.body);
    await newProduct.save();
    res.redirect(`/memo/${newProduct._id}`);
});

app.get('/memo/:id', async (req, res) => {
    const { id } = req.params;
    const product = await Product.findById(id);
    res.render('products/show', { product });
});

app.get('/memo/:id/edit', async (req, res) => {
    const { id } = req.params;
    const product = await Product.findById(id);
    res.render('products/edit', { product });
});

app.put('/memo/:id', async (req, res) => {
    const { id } = req.params;
    const product = await Product.findByIdAndUpdate(id, req.body, { runValidators: true, new: true });
    res.redirect(`/memo/${product._id}`);
});

app.delete('/memo/:id', async (req, res) => {
    const { id } = req.params;
    await Product.findByIdAndDelete(id);
    res.redirect('/memo');
});

module.exports = app;
