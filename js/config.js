// API配置文件
const CONFIG = {
    // 开发环境配置
    development: {
        API_BASE_URL: 'http://localhost:50331/api'
    },
    // 生产环境配置
    production: {
        API_BASE_URL: 'http://server.bg2fou.top:50331/api'  // 您的服务器API地址
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