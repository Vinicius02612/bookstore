const express = require('express')
const app = express()

const exphbs = require('express-handlebars')
const mysql = require('mysql')
const port = 1900

// lendo o corpo da body para salvar os dados
app.use(
    express.urlencoded({
        extended:true,
    }),
)
// recebendo os dados como JSON
app.use(express.json())



app.engine('handlebars', exphbs.engine())
app.set('view engine', 'handlebars')

app.use(express.static('public'))


//criando uma conexão com banco de dados MYSQL
const conn = mysql.createConnection({
    host:'localhost',
    user:'root',
    password:'vini123@',
    database:'livraria'
})

conn.connect(function(err){
    if(err){
        console.log(err)
    }
    console.log('Conexão Realizada com Sucesso')
})
app.post('/books/insertbooks', (req, res)=>{
    const title = req.body.title
    const pages = req.body.pages
    const category = req.body.category

    const sql = `INSERT INTO ebooks (title,pages,category) VALUES ('${title}', '${pages}', '${category}')`


    conn.query(sql,function(err){
        if(err){
            console.log(err)
        }
        console.log("Dados salvos com sucesso!!")
        res.redirect('/')
    })

//    console.log(title,pages, category)
})

app.get('/books', (req, res) =>{
    // Executando query no banco de dados
    const sql = 'SELECT * FROM ebooks'

    conn.query(sql, function(err, data){
        if(err){
            console.log(err)
            return
        }
        const books = data

//        console.log(books)
        res.render('books', {books})
    })
})

app.get('/books/:codigo', (req, res) =>{
    const id = req.params.codigo

    const sql = `SELECT * ebooks WHERE id = ${id}`

    conn.query(sql , function(err, data){
        if(err){
            console.log(err)
        }
        const books = data[0]

        res.render('book', {books})
    })
})


app.use('/', (req, res)=>{
    res.render('home')
})


// app.post('/books/insertbook', (req, res) => {
//     const title = req.body.title
//     const pageqty = req.body.pageqty
 
//     const sql = 'INSERT INTO books (title, pageqty) VALUES (?)';
//     const values = [title, pageqty];
 
//     conn.query(sql, [values], function (err)  {
//         if (err) {
//             console.log(err)
//         }
//         res.redirect('/')
//     })
// })


app.listen(port, ()=>{
    console.log('App rodando..')
})