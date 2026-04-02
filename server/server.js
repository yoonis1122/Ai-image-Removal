import 'dotenv/config'
import cors from 'cors'
import express from 'express'
import connectDb from './configs/mongodb.js'
import useRouter from './routes/userRoute.js'


//App config//

const PORT = process.env.PORT || 4000

const app = express()

await connectDb()

//INIIAlise middlewares//

app.use(express.json())
app.use(cors())

//api routes//
app.get('/', (req, res) =>{
    res.send("api working")
})
app.use("/api/user,", useRouter)

app.listen(PORT, ()=>{console.log(`server running port ${PORT}`)})