import { gql } from "@apollo/client";



export const CREATE_TRANSACTION=gql`

     mutation CreateTransaction($input:TransactionInput!){

            createTrasaction(input:$input){

               _id
               description
               amount
               date
               paymentType
               cateogry
               location

             }


     }
`

export const UPDATE_TRANSACTION=gql`

    mutation UpdateTransaction($input:updateTransactionInput!){
                     updateTransaction(input:$input)}{
                        transactionId
                        description
                        amount
                        paymentType
                        category
                        location
                        date
                     
                     }

          }


`

export const DELETE_TRANSACTION=gql`

     mutation DeleteTransaction($transactionId:ID!){
       deleteTransaction(transactionId:$transactionId){
           _id
           description
           amount
           paumentType
           category
           location
           date
       }

      
}


`