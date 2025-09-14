// API配置文件
const CONFIG = {
    // 开发环境配置
    development: {
        API_BASE_URL: 'http://localhost:50331/api'
    },
    // 生产环境配置
    production: {
        API_BASE_URL: 'https://search.bg2fou.top/api',  // 主要API地址 (HTTPS)
        FALLBACK_URL: 'http://search.bg2fou.top/api'    // 备用API地址 (HTTP，用于排查SSL问题)
    }
};

// 根据当前环境自动选择配置
const getApiBaseUrl = () => {
    // 检测是否为localhost或127.0.0.1
    const isLocal = window.location.hostname === 'localhost' || 
                   window.location.hostname === '127.0.0.1' ||
                   window.location.hostname === '';
    
    const env = isLocal ? 'development' : 'production';
    return CONFIG[env].API_BASE_URL;
};

// 获取备用URL（仅用于调试）
const getFallbackUrl = () => {
    return CONFIG.production.FALLBACK_URL;
};

// 导出API基础URL
window.API_BASE_URL = getApiBaseUrl();
window.FALLBACK_URL = getFallbackUrl();