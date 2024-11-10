import { gql } from "@apollo/client";


export const GET_AUTHENTICATE_USER=gql`

    query GetAuthenticatedUser{
        authUser {
            _id
            username
            name
            profilePicture
        }
        
        
    }
    
`