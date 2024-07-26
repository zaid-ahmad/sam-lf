"use server";

import { auth } from "@/auth";

import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

import crypto from "crypto";

const generateFileName = (bytes = 32) =>
    crypto.randomBytes(bytes).toString("hex");

const s3Client = new S3Client({
    region: process.env.AWS_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
});

const allowedFileTypes = [
    "image/png",
    "image/jpeg",
    "image/jpg",
    "image/webp",
    "application/pdf",
];
const maxFileSize = 1024 * 1024 * 10; // 10 MB

export async function getSignedURL({ fileType, fileSize, checksum }) {
    const session = await auth();

    if (!session) {
        return { failure: "not authenticated" };
    }

    if (!allowedFileTypes.includes(fileType)) {
        return { failure: "File type not allowed" };
    }

    if (fileSize > maxFileSize) {
        return { failure: "File size too large" };
    }

    const fileName = generateFileName();

    const putObjectCommand = new PutObjectCommand({
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: fileName,
        ContentType: fileType,
        ContentLength: fileSize,
        ChecksumSHA256: checksum,
    });

    const url = await getSignedUrl(
        s3Client,
        putObjectCommand,
        { expiresIn: 60 } // 60 seconds
    );

    return { success: { url } };
}
