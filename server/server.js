import 'dotenv/config'
import cors from 'cors'
import express from 'express'
import connectDb from './configs/mongodb.js'
import useRouter from './routes/userRoute.js'
import imageRoute from './routes/imageRoute.js'

import paymentRouter from './routes/paymentRoute.js'


//App config//

const PORT = process.env.PORT || 4000

const app = express()

await connectDb()

//INIIAlise middlewares//

app.use(cors())
// Stripe webhook Needs raw body, register it before express.json()
app.use("/api/payment/stripe-webhook", express.raw({ type: 'application/json' }));
app.use(express.json())
app.use("/api/payment", paymentRouter)


//api routes//
app.get('/', (req, res) =>{
    res.send("api working")
})
app.use("/api/user", useRouter)
app.use("/api/image", imageRoute)

app.listen(PORT, ()=>{console.log(`server running port ${PORT}`)})