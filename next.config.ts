import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
    webpack(config) {
        config.infrastructureLogging = {
            level: 'verbose',
        };
        return config;
    },
};

export default nextConfig;
