/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname:
                    "lf-sam-appointment-images.s3.ca-central-1.amazonaws.com",
            },
        ],
    },
};

export default nextConfig;
