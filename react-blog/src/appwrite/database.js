import conf from './config.js';
import { Client, Databases, Query, ID } from "appwrite";

export class BlogService {
    client = new Client();
    databases;

    constructor() {
        this.client
            .setEndpoint(conf.appwriteUrl)
            .setProject(conf.appwriteProjectId);
        this.databases = new Databases(this.client);
    }

    async createPost({ title, content, featuredImage, status, userId, author }) {
        const payload = {
            title,
            content,
            featuredImage,
            status,
            userID: userId,
            author
        };

        const maxRetries = 3;
        let attempt = 0;

        while (attempt < maxRetries) {
            try {
                return await this.databases.createDocument(
                    conf.appwriteDatabaseId,
                    conf.appwriteCollectionId,
                    ID.unique(),
                    payload
                );
            } catch (error) {
                if (error.message && error.message.includes('Unknown attribute:')) {
                    const match = error.message.match(/Unknown attribute:\s*"([^"]+)"/);
                    if (match && match[1]) {
                        const missingAttr = match[1];
                        console.warn(`Appwrite Collection is missing attribute "${missingAttr}". Removing and retrying.`);
                        delete payload[missingAttr];
                        
                        if (missingAttr === 'userID') {
                            payload.userId = userId;
                        } else if (missingAttr === 'userId') {
                            delete payload.userId;
                        }

                        if (missingAttr === 'featuredImage') {
                            payload.featuredimage = featuredImage;
                        } else if (missingAttr === 'featuredimage') {
                            payload.image = featuredImage;
                        } else if (missingAttr === 'image') {
                            delete payload.image;
                        }

                        attempt++;
                        continue;
                    }
                }
                console.error("Appwrite Service :: createPost :: error", error);
                throw error;
            }
        }
    }

    async updatePost(documentId, { title, content, featuredImage, status }) {
        const payload = {
            title,
            content,
            featuredImage,
            status
        };

        const maxRetries = 3;
        let attempt = 0;

        while (attempt < maxRetries) {
            try {
                return await this.databases.updateDocument(
                    conf.appwriteDatabaseId,
                    conf.appwriteCollectionId,
                    documentId,
                    payload
                );
            } catch (error) {
                if (error.message && error.message.includes('Unknown attribute:')) {
                    const match = error.message.match(/Unknown attribute:\s*"([^"]+)"/);
                    if (match && match[1]) {
                        const missingAttr = match[1];
                        console.warn(`Appwrite Collection is missing attribute "${missingAttr}". Removing and retrying update.`);
                        delete payload[missingAttr];

                        if (missingAttr === 'featuredImage') {
                            payload.featuredimage = featuredImage;
                        } else if (missingAttr === 'featuredimage') {
                            payload.image = featuredImage;
                        } else if (missingAttr === 'image') {
                            delete payload.image;
                        }

                        attempt++;
                        continue;
                    }
                }
                console.error("Appwrite Service :: updatePost :: error", error);
                throw error;
            }
        }
    }

    async deletePost(documentId) {
        try {
            await this.databases.deleteDocument(
                conf.appwriteDatabaseId,
                conf.appwriteCollectionId,
                documentId
            );
            return true;
        } catch (error) {
            console.error("Appwrite Service :: deletePost :: error", error);
            throw error;
        }
    }

    async getPost(documentId) {
        try {
            return await this.databases.getDocument(
                conf.appwriteDatabaseId,
                conf.appwriteCollectionId,
                documentId
            );
        } catch (error) {
            console.error("Appwrite Service :: getPost :: error", error);
            throw error;
        }
    }

    // For visitors/users to explore active posts
    async getPosts(queries = [Query.equal("status", "active")]) {
        try {
            return await this.databases.listDocuments(
                conf.appwriteDatabaseId,
                conf.appwriteCollectionId,
                queries
            );
        } catch (error) {
            console.error("Appwrite Service :: getPosts :: error", error);
            throw error;
        }
    }

    // For admins to check all posts regardless of status
    async getAllPosts(queries = []) {
        try {
            return await this.databases.listDocuments(
                conf.appwriteDatabaseId,
                conf.appwriteCollectionId,
                queries
            );
        } catch (error) {
            console.error("Appwrite Service :: getAllPosts :: error", error);
            throw error;
        }
    }

    async updateLikes(documentId, likes) {
        const payload = { likes };
        const maxRetries = 3;
        let attempt = 0;

        while (attempt < maxRetries) {
            try {
                return await this.databases.updateDocument(
                    conf.appwriteDatabaseId,
                    conf.appwriteCollectionId,
                    documentId,
                    payload
                );
            } catch (error) {
                if (error.message && error.message.includes('Unknown attribute:')) {
                    const match = error.message.match(/Unknown attribute:\s*"([^"]+)"/);
                    if (match && match[1]) {
                        const missingAttr = match[1];
                        console.warn(`Appwrite Collection is missing likes attribute "${missingAttr}". Retrying with alternative.`);
                        delete payload[missingAttr];

                        if (missingAttr === 'likes') {
                            payload.Likes = likes;
                        } else if (missingAttr === 'Likes') {
                            payload.like = likes;
                        } else if (missingAttr === 'like') {
                            delete payload.like;
                        }

                        attempt++;
                        continue;
                    }
                }
                console.error("Appwrite Service :: updateLikes :: error", error);
                throw error;
            }
        }
    }
}

const blogService = new BlogService();
export default blogService;
