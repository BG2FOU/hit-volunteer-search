// API配置文件
const CONFIG = {
    // 开发环境配置
    development: {
        API_BASE_URL: 'http://localhost:50331/api'
    },
    // 生产环境配置
    production: {
        // 主要地址：直接IP访问（已验证可用）
        API_BASE_URL: 'http://59.110.114.69:50331/api',
        // 备用地址：域名访问（如果服务器修复）
        API_BASE_URL_FALLBACK: 'https://search.bg2fou.top/api'
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

// 导出API基础URL
window.API_BASE_URL = getApiBaseUrl();
window.API_BASE_URL_FALLBACK = CONFIG.production.API_BASE_URL_FALLBACK;

console.log(`API配置 - 环境: ${window.location.hostname === 'localhost' ? '开发' : '生产'}, URL: ${window.API_BASE_URL}`);