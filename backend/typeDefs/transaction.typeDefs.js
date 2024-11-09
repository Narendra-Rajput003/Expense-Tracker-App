

const transactionTypeDefs=` #graphql

type Transaction {
        id: ID! 
        userId: ID!
        amount:Float!
        category:String!
        description: String!
        paymentType: String!
        location:String
        date:String!
}

type Query {

transactions: [Transaction]
transaction(transactionId: ID!): Transaction

}

type Mutation {

createTransaction(input:createTransaction!):Transaction!
updateTransaction(input:updateTransactionInput!):Transaction!
deleteTransaction(transactionId:ID!):Transaction 
}

input createTransaction {
 description: String!
 paymentType: String!
 location: String
 date: String!
 amount: Float!
 category: String!

}

input updateTransactionInput {
transactionId: ID!
}

input deleteTransaction {
transactionId: ID!
}

`

export  default transactionTypeDefs;