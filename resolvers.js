import { fileURLToPath } from 'url';
import path from 'path';
import fs from 'fs';
import { GraphQLUpload } from 'graphql-upload-minimal';
import sharp from 'sharp';
import axios from 'axios';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const BUNNY_API_KEY = process.env.BUNNY_API_KEY;
const BUNNY_LIBRARY_ID = process.env.BUNNY_LIBRARY_ID;
const BUNNY_BASE_URL = `https://video.bunnycdn.com/library/${BUNNY_LIBRARY_ID}/videos`;

const sanitizeFilename = (filename) => {
    const extension = path.extname(filename).toLowerCase();
    const baseName = path.basename(filename, extension);
    const sanitizedBaseName = baseName
        .replace(/[^a-zA-Z0-9-]/g, "") // Replace non-alphanumeric with underscore
        .replace(/\s+/g, "_"); // Replace spaces with underscores
    return `${sanitizedBaseName}${extension}`;
};

const resolvers = {
    Upload: GraphQLUpload,
    Query: {
        hello: () => "Hello world",
        videos: async () => {
            // return await Video.find().sort({ createdAt: -1 });
            return [];
        },
        users: async () => {
            // return await User.find().sort({ creationDate: -1 });
            return [];
        }
    },
    Mutation: {
        createUser: async (_, args) => {
            try {
                // const newUser = new User(args);
                // await newUser.save();
                // return newUser;
                return { ...args, _id: "mock-id" };
            } catch (error) {
                console.error("Error creating user:", error);
                throw new Error(`Failed to create user: ${error.message}`);
            }
        },
        uploadFile: async (_, { file, folder = "files", allowedTypes }) => {
            try {
                const { createReadStream, filename, mimetype } = await file;
                const stream = createReadStream();
                if (
                    allowedTypes &&
                    allowedTypes?.length > 0 &&
                    !allowedTypes.includes(mimetype)
                ) {
                    throw new Error(
                        `Invalid file type. Allowed types: ${allowedTypes.join(", ")}`
                    );
                }

                const sanitizeFolder = (folder) =>
                    folder.replace(/[^a-zA-Z0-9_-]/g, "");
                const sanitizedFolder = sanitizeFolder(folder);

                const uploadDir = path.join(__dirname, "uploads", sanitizedFolder);
                if (!fs.existsSync(uploadDir)) {
                    fs.mkdirSync(uploadDir, { recursive: true });
                }
                const sanitizedFilename = sanitizeFilename(filename);
                let stamp = Date.now();
                const uniqueFilename = `${stamp}-${sanitizedFilename}`;
                const filePath = path.join(uploadDir, uniqueFilename);
                const thumbnailFilename = uniqueFilename.replace(
                    /(\.\w+)$/,
                    "-thumb.webp"
                );
                const thumbnailPath = path.join(uploadDir, thumbnailFilename);

                await new Promise((resolve, reject) =>
                    stream
                        .pipe(fs.createWriteStream(filePath))
                        .on("finish", resolve)
                        .on("error", reject)
                );

                let thumbnailUrl = null;
                if (mimetype.startsWith("image/")) {
                    await sharp(filePath)
                        .resize({ width: 200, height: 200, fit: "cover" })
                        .webp({ quality: 80 })
                        .toFile(thumbnailPath);
                    thumbnailUrl = `https://rawdati.com/uploads/${sanitizedFolder}/${thumbnailFilename}`;
                }

                const fileUrl = `https://rawdati.com/uploads/${sanitizedFolder}/${uniqueFilename}`;
                return { url: fileUrl, thumbnailUrl };
            } catch (error) {
                console.error("Error uploading file:", error);
                throw new Error(`Failed to upload file: ${error.message}`);
            }
        },
        uploadFiles: async (_, { files, folder = "files", allowedTypes }) => {
            try {
                const sanitizeFolder = (folder) =>
                    folder.replace(/[^a-zA-Z0-9_-]/g, "");
                const sanitizedFolder = sanitizeFolder(folder);
                const uploadDir = path.join(__dirname, "uploads", sanitizedFolder);
                if (!fs.existsSync(uploadDir)) {
                    fs.mkdirSync(uploadDir, { recursive: true });
                }

                const uploadedFiles = await Promise.all(
                    files.map(async (file, index) => {
                        const { createReadStream, filename, mimetype } = await file;

                        if (
                            allowedTypes &&
                            allowedTypes?.length > 0 &&
                            !allowedTypes.includes(mimetype)
                        ) {
                            throw new Error(
                                `Invalid file type for file ${filename}. Allowed types: ${allowedTypes.join(
                                    ", "
                                )}`
                            );
                        }

                        const stream = createReadStream();
                        const sanitizedFilename = sanitizeFilename(filename);
                        const uniqueFilename = `${Date.now()}-${index}-${sanitizedFilename}`;
                        const filePath = path.join(uploadDir, uniqueFilename);
                        const thumbnailFilename = uniqueFilename.replace(
                            /(\.\w+)$/,
                            "-thumb.webp"
                        );
                        const thumbnailPath = path.join(uploadDir, thumbnailFilename);

                        await new Promise((resolve, reject) =>
                            stream
                                .pipe(fs.createWriteStream(filePath))
                                .on("finish", resolve)
                                .on("error", reject)
                        );

                        let thumbnailUrl = null;
                        if (mimetype.startsWith("image/")) {
                            await sharp(filePath)
                                .resize({ width: 200, height: 200, fit: "cover" })
                                .webp({ quality: 80 })
                                .toFile(thumbnailPath);
                            thumbnailUrl = `https://rawdati.com/uploads/${sanitizedFolder}/${thumbnailFilename}`;
                        }

                        return {
                            url: `https://rawdati.com/uploads/${sanitizedFolder}/${uniqueFilename}`,
                            thumbnailUrl,
                        };
                    })
                );

                return { urls: uploadedFiles };
            } catch (error) {
                console.error("Error uploading files:", error);
                throw new Error(`Failed to upload files: ${error.message}`);
            }
        },

        //? Upload video to BunnyCDN Stream 
        uploadVideoToBunny: async (_, { file, title }) => {
            const { createReadStream, filename, mimetype } = await file;

            //? Validate MIME Type
            if (!mimetype.startsWith('video/')) {
                throw new Error('File must be a video');
            }

            try {
                //? 1. Create Video Entry in BunnyCDN Stream Library
                const createResponse = await axios.post(
                    BUNNY_BASE_URL,
                    { title: title || filename },
                    {
                        headers: {
                            AccessKey: BUNNY_API_KEY,
                            'Content-Type': 'application/json',
                        },
                    }
                );

                const videoId = createResponse.data.guid;

                //? 3. Upload the video stream to BunnyCDN
                const stream = createReadStream();

                await axios.put(
                    `${BUNNY_BASE_URL}/${videoId}`,
                    stream,
                    {
                        headers: {
                            AccessKey: BUNNY_API_KEY,
                            'Content-Type': 'application/octet-stream',
                        },
                        maxContentLength: Infinity,
                        maxBodyLength: Infinity
                    }
                );
                //? 4. Return video metadata After successful upload
                return {
                    id: videoId,
                    title: title || filename,
                    bunnyVideoId: videoId,
                    status: 'processing',
                    createdAt: new Date().toISOString()

                };

            } catch (error) {
                console.error('BunnyCDN Upload Error:', error.response ? error.response.data : error.message);
                throw new Error('Failed to upload video to BunnyCDN');
            }
        }
    }
};

export default resolvers;
