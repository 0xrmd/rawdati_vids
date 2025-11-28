import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { graphqlUploadExpress } from 'graphql-upload-minimal';
import typeDefs from './typeDefs.js';
import resolvers from './resolvers.js';
import path from 'path';
import { fileURLToPath } from 'url';
import multer from 'multer';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const multerParser = multer(
    { dest: path.join(__dirname, 'uploads/') }
);
const app = express();
const PORT = process.env.PORT || 3000;

//* Apollo Server Setup
const server = new ApolloServer({
    typeDefs,
    resolvers,
    csrfPrevention: false,
});
const startServer = async () => {
    try {
        await server.start();
        console.log('Apollo Server started');
    } catch (error) {
        console.error('Error starting Apollo Server:', error);
        process.exit(1);
    }

    //* Middleware
    app.use(cors());
    app.use(graphqlUploadExpress());
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));


    app.use((req, res, next) => {
        if (!req.body) req.body = {};
        next();
    });

    //* POST REQ FOR Video UPLOADS
    app.post('/uploads', multerParser.fields([
        { name: 'video', }
    ]), async (req, res) => {
        const attachment = req.files.video[0];
        if (!attachment) {
            return res.status(400).json({ message: 'No video uploaded' });
        }
        //* Handle Upload 
        const uploadResponse = await handleFileUpload(attachment);
        if (uploadResponse) {
            res.status(201).json({ message: 'File uploaded successfully', url: uploadResponse });
        } else {
            res.status(500).json({ message: 'File upload failed' });
        }

    });

    //* Apollo Middleware
    app.use('/graphql', expressMiddleware(server));

    //* Root route for testing
    app.get('/', (req, res) => {
        res.json({ message: 'Welcome to the GraphQL API' });
    });

    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
        console.log(`GraphQL endpoint: http://localhost:${PORT}/graphql`);
    });
};
// TODO CHECK resolvers.js File 

startServer();