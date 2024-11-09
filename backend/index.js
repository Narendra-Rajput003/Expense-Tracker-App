import express from "express";
import * as http from "node:http";
import cors from "cors"
import dotenv from "dotenv";

import connectMongo  from "connect-mongodb-session"
import session from "express-session";
import passport  from "passport";

import {  buildContext } from "graphql-passport";

import {ApolloServer} from "@apollo/server";
import {startStandaloneServer} from "@apollo/server/standalone";
import {expressMiddleware} from "@apollo/server/express4";
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";
import mergedResolvers from "./resolvers/index.js";
import mergedTypeDefs from "./typeDefs/index.js";
import {connectDb} from "./db/db.config.js";
import {configurePassport} from "./passport/passport.config.js";


dotenv.config();
configurePassport()
const app=express();
const httpServer=http.createServer(app);


const MongoDBStore=connectMongo(session);

const store=new MongoDBStore({
    uri:process.env.MONGODB_URI,
    collection:"sessions",
})

app.use(
    session({
        secret:process.env.SESSION_SECRET,
        resave:false,
        saveUninitialized:false,
        cookie:{
            maxAge:1000*60*60*24*7 ,       // 7 days
            httpOnly:true
        },
        store:store
    })
);



store.on("error",(err)=>console.log(err))

// passport
app.use(passport.initialize());
app.use(passport.session());

const server=new ApolloServer({
    typeDefs:mergedTypeDefs,
    resolvers:mergedResolvers,
    plugins:[ApolloServerPluginDrainHttpServer({httpServer})]
})
await  server.start();


app.use(
    "/graphql",
    cors({
        origin:"http://localhost:3000",
        credentials:true
    }),
    express.json(),
    expressMiddleware(server,{
        context:async({req,res})=>buildContext({req,res})
    })

    )
await  new Promise( (resolve)=>httpServer.listen({port:4000},resolve))

await  connectDb();
console.log(`Server ready at http://localhost:4000/graphql`);

