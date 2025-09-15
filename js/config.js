// API配置文件
const CONFIG = {
    // 开发环境配置
    development: {
        API_BASE_URL: 'http://localhost:50331/api'
    },
    // 生产环境配置
    production: {
        // 主要地址：HTTPS域名访问（优先使用HTTPS避免混合内容问题）
        API_BASE_URL: 'https://search.bg2fou.top/api',
        // 备用地址列表：按优先级尝试
        API_BASE_URL_FALLBACK: [
            'https://server.bg2fou.top:50331//api',
            'https://59.110.114.69:50331/api',
            'http://server.bg2fou.top:50331//api',
            'http://59.110.114.69:50331/api'
        ]
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