import { gql } from "@apollo/client";

export const GET_AUTHENTICATE_USER = gql`
  query GetAuthenticatedUser {
    authUser {
      _id
      username
      name
      profilePicture
    }
  }
`;

export const GET_USER_AND_TRANSACTIONS = gql`
  query GetUserAndTransactions($userId: ID!) {
    _id
    name
    username
    profilePicture

    transactions {
      _id
      description
      paymentType
      catagory
      amount
      date
      location
    }
  }
`;
