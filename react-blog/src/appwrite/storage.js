import conf from './config.js';
import { Client, Storage, ID, Permission, Role } from "appwrite";

export class StorageService {
    client = new Client();
    storage;

    constructor() {
        this.client
            .setEndpoint(conf.appwriteUrl)
            .setProject(conf.appwriteProjectId);
        this.storage = new Storage(this.client);
    }

    async uploadFile(file) {
        try {
            return await this.storage.createFile(
                conf.appwriteBucketId,
                ID.unique(),
                file,
                [
                    Permission.read(Role.any()) // Guarantee public read access for guest users
                ]
            );
        } catch (error) {
            console.error("Appwrite Service :: uploadFile :: error", error);
            throw error;
        }
    }

    async deleteFile(fileId) {
        try {
            await this.storage.deleteFile(
                conf.appwriteBucketId,
                fileId
            );
            return true;
        } catch (error) {
            console.error("Appwrite Service :: deleteFile :: error", error);
            return false;
        }
    }

    getFilePreview(fileId) {
        try {
            if (!fileId) return null;
            // Manually construct direct file view URL to ensure reliable string rendering in React image tags
            const url = `${conf.appwriteUrl}/storage/buckets/${conf.appwriteBucketId}/files/${fileId}/view?project=${conf.appwriteProjectId}`;
            return url;
        } catch (error) {
            console.error("Appwrite Service :: getFilePreview :: error", error);
            return null;
        }
    }
}

const storageService = new StorageService();
export default storageService;
