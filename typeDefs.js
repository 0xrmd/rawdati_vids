import { gql } from 'graphql-tag';

const typeDefs = gql`
  scalar Upload

  type Socials {
    facebook: String
    instagram: String
    twitter: String
    linkedin: String
  }

  type Adress {
    street: String
    city: String
    state: String
    zip: String
    country: String
  }

  type Notification {
    id: ID
    message: String
    date: String
    read: Boolean
  }

  type LogginLog {
    ip: String
    date: String
    device: String
  }

  type User {
    _id: ID!
    userType: String!
    fName: String!
    lName: String!
    fullName: String!
    birthDay: String!
    gender: String!
    telephone: String
    addedDate: String
    email: String!
    login: String!
    password: String!
    socials: Socials
    adresse: Adress
    profilePic: String
    accountStatus: String!
    notifications: [Notification!]
    logginLogs: [LogginLog!]
    lastLogin: String 
    lastIp: String
    creationDate: String
  }

  type FileUploadResponse {
    url: String!
    thumbnailUrl: String
  }

  type FilesUploadResponse {
    urls: [FileUploadResponse!]!
  }

  type Video {
    id: ID!
    title: String!
    bunnyVideoId: String!
    status: String!
    createdAt: String!
  }

  type Query {
    hello: String
    videos: [Video]
    users: [User]
  }

  type Mutation {
    uploadFile(file: Upload!, folder: String, allowedTypes: [String]): FileUploadResponse!
    uploadFiles(files: [Upload!]!, folder: String, allowedTypes: [String]): FilesUploadResponse!
    uploadVideoToBunny(file: Upload!, title: String!): Video
    
    createUser(
      userType: String!, 
      fName: String!, 
      lName: String!, 
      birthDay: String!, 
      gender: String!, 
      email: String!, 
      login: String!, 
      password: String!,
      telephone: String
    ): User
  }
`;

export default typeDefs;
