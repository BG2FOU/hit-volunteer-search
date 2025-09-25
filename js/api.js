// API工具函数
class VolunteerAPI {
    constructor() {
        this.baseURL = window.API_BASE_URL;
        this.fallbackURL = window.API_BASE_URL_FALLBACK;
    }

    // 通用请求方法 - 支持备用URL数组
    async request(endpoint, options = {}) {
        const urls = [this.baseURL];
        
        // 处理备用URL（可能是字符串或数组）
        if (this.fallbackURL) {
            if (Array.isArray(this.fallbackURL)) {
                urls.push(...this.fallbackURL.filter(url => url !== this.baseURL));
            } else if (this.fallbackURL !== this.baseURL) {
                urls.push(this.fallbackURL);
            }
        }
        
        const headers = { ...(options.headers || {}) };

        // 只有在POST请求且有请求体时才设置JSON头
        const hasBody = options.body !== undefined && options.body !== null;
        const isPost = options.method === 'POST';
        
        if (hasBody && isPost && !headers['Content-Type']) {
            headers['Content-Type'] = 'application/json';
        }

        const config = { 
            ...options, 
            headers,
            timeout: 15000  // 缩短超时时间
        };

        let lastError;
        
        // 尝试每个URL
        for (let urlIndex = 0; urlIndex < urls.length; urlIndex++) {
            const baseUrl = urls[urlIndex];
            const url = `${baseUrl}${endpoint}`;
            console.log(`尝试API URL ${urlIndex + 1}/${urls.length}: ${url}`);
            
            // 每个URL尝试2次
            for (let attempt = 1; attempt <= 2; attempt++) {
                try {
                    console.log(`  - 请求尝试 ${attempt}/2`);
                    
                    const response = await fetch(url, config);
                    
                    if (!response.ok) {
                        const errorData = await response.json().catch(() => ({}));
                        throw new Error(errorData.error || `HTTP ${response.status}: ${response.statusText}`);
                    }

                    console.log(`✅ API请求成功: ${url}`);
                    return await response.json();
                } catch (error) {
                    lastError = error;
                    console.error(`❌ API请求失败 (URL ${urlIndex + 1}, 尝试 ${attempt}):`, error.message);
                    
                    // 如果是第一次尝试且是网络错误，等待后重试
                    if (attempt === 1 && (
                        error.message.includes('Failed to fetch') ||
                        error.message.includes('ERR_CONNECTION_RESET') ||
                        error.message.includes('Network Error') ||
                        error.message.includes('ERR_SSL_PROTOCOL_ERROR')
                    )) {
                        console.log(`  - 等待1秒后重试...`);
                        await new Promise(resolve => setTimeout(resolve, 1000));
                        continue;
                    }
                    
                    // 如果第二次尝试也失败，尝试下一个URL
                    break;
                }
            }
        }
        
        console.error('🚫 所有API尝试都失败:', lastError);
        
        // 如果是HTTPS页面且所有HTTPS端点都失败，提供HTTP降级选项
        if (window.location.protocol === 'https:' && 
            lastError.message.includes('Failed to fetch') || 
            lastError.message.includes('ERR_CONNECTION_RESET')) {
            
            const httpFallback = 'http://59.110.114.69:50331/api' + endpoint;
            const userConfirm = confirm(
                '所有HTTPS API端点都无法访问。\n\n' +
                '是否尝试使用HTTP端点？\n' +
                '（注意：这可能会显示安全警告）\n\n' +
                '点击"确定"将尝试HTTP连接，点击"取消"放弃请求。'
            );
            
            if (userConfirm) {
                try {
                    console.log(`📡 尝试HTTP降级: ${httpFallback}`);
                    const response = await fetch(httpFallback, config);
                    if (!response.ok) {
                        const errorData = await response.json().catch(() => ({}));
                        throw new Error(errorData.error || `HTTP ${response.status}: ${response.statusText}`);
                    }
                    console.log(`✅ HTTP降级成功: ${httpFallback}`);
                    return await response.json();
                } catch (httpError) {
                    console.error('❌ HTTP降级也失败:', httpError.message);
                    throw new Error(`HTTPS和HTTP端点都无法访问: ${httpError.message}`);
                }
            }
        }
        
        throw lastError;
    }

    // 单个查询
    async search(name = '', studentId = '') {
        const params = new URLSearchParams();
        if (name) params.append('name', name);
        if (studentId) params.append('student_id', studentId);
        
        return this.request(`/search?${params.toString()}`);
    }

    // 批量查询
    async batchSearch(queries) {
        return this.request('/batch', {
            method: 'POST',
            body: JSON.stringify({ queries })
        });
    }

    // 获取详细信息
    async getDetails(studentId) {
        return this.request(`/details?student_id=${encodeURIComponent(studentId)}`);
    }
}

// 工具函数
const Utils = {
    // 显示错误信息
    showError(message, elementId = 'errorMessage') {
        const errorDiv = document.getElementById(elementId);
        if (errorDiv) {
            errorDiv.textContent = message;
            errorDiv.style.display = 'block';
        } else {
            alert('错误: ' + message);
        }
    },

    // 隐藏错误信息
    hideError(elementId = 'errorMessage') {
        const errorDiv = document.getElementById(elementId);
        if (errorDiv) {
            errorDiv.textContent = '';
            errorDiv.style.display = 'none';
        }
    },

    // 显示成功信息
    showSuccess(message, elementId = 'successMessage') {
        const successDiv = document.getElementById(elementId);
        if (successDiv) {
            successDiv.textContent = message;
            successDiv.style.display = 'block';
            setTimeout(() => this.hideSuccess(elementId), 3000);
        }
    },

    // 隐藏成功信息
    hideSuccess(elementId = 'successMessage') {
        const successDiv = document.getElementById(elementId);
        if (successDiv) {
            successDiv.textContent = '';
            successDiv.style.display = 'none';
        }
    },

    // 显示加载状态
    showLoading(elementId = 'resultsBody') {
        const element = document.getElementById(elementId);
        if (element) {
            element.innerHTML = '<tr><td colspan="10" class="loading">正在查询</td></tr>';
        }
    },

    // 复制到剪贴板
    copyToClipboard(element) {
        try {
            const range = document.createRange();
            range.selectNode(element);
            window.getSelection().removeAllRanges();
            window.getSelection().addRange(range);
            document.execCommand('copy');
            window.getSelection().removeAllRanges();
            this.showSuccess('复制成功！');
        } catch (error) {
            console.error('复制失败:', error);
            this.showError('复制失败，请手动选择内容复制');
        }
    },

    // 解析批量查询输入
    parseBatchInput(input) {
        return input.split('\n').map(line => {
            const trimmed = line.trim();
            if (!trimmed) return null;

            // 自动识别单字段输入类型：纯数字为学号，其他为姓名
            if (trimmed.split(/\s+/).length === 1) {
                const isStudentId = /^\d+$/.test(trimmed);
                return {
                    name: isStudentId ? '' : trimmed,
                    student_id: isStudentId ? trimmed : ''
                };
            }

            // 处理多字段输入（姓名+学号）
            const parts = trimmed.split(/\s+/);
            if (parts.length >= 2) {
                const lastPart = parts[parts.length - 1];
                const isLastPartStudentId = /^\d+$/.test(lastPart);
                
                if (isLastPartStudentId) {
                    return {
                        name: parts.slice(0, -1).join(' '),
                        student_id: lastPart
                    };
                } else {
                    return {
                        name: trimmed,
                        student_id: ''
                    };
                }
            }

            return null;
        }).filter(query => query !== null);
    },

    // 导出数据为CSV
    exportToCSV(filename, headers, rows) {
        if (!Array.isArray(headers) || headers.length === 0) {
            console.error('导出CSV失败：表头无效');
            this.showError('导出失败：表头无效');
            return;
        }

        if (!Array.isArray(rows) || rows.length === 0) {
            this.showError('没有可导出的数据');
            return;
        }

        const csvLines = [];
        csvLines.push(headers.map(header => this.escapeCSVValue(header)).join(','));

        rows.forEach(row => {
            const normalizedRow = Array.isArray(row)
                ? row
                : headers.map(key => (row && key in row) ? row[key] : '');
            csvLines.push(normalizedRow.map(value => this.escapeCSVValue(value)).join(','));
        });

        const csvContent = '\ufeff' + csvLines.join('\r\n');

        try {
            const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = filename || `export_${this.formatTimestampForFilename()}.csv`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
            this.showSuccess('CSV导出成功！');
        } catch (error) {
            console.error('导出CSV失败:', error);
            this.showError('导出CSV失败，请稍后再试');
        }
    },

    // CSV字段转义
    escapeCSVValue(value) {
        if (value === null || value === undefined) {
            return '';
        }

        const stringValue = String(value).replace(/\r?\n/g, '\n');
        const needsQuotes = /[",\n]/.test(stringValue);
        const escapedValue = stringValue.replace(/"/g, '""');
        return needsQuotes ? `"${escapedValue}"` : escapedValue;
    },

    // 生成时间戳用于文件名
    formatTimestampForFilename() {
        const now = new Date();
        const pad = (num) => num.toString().padStart(2, '0');
        return `${now.getFullYear()}${pad(now.getMonth() + 1)}${pad(now.getDate())}_${pad(now.getHours())}${pad(now.getMinutes())}${pad(now.getSeconds())}`;
    },

    // 清理文件名组件
    sanitizeFilenameComponent(text) {
        if (text === undefined || text === null) {
            return '';
        }

        const trimmed = String(text).trim();
        if (!trimmed) {
            return '';
        }

        // 移除文件名非法字符，压缩空白
        return trimmed
            .replace(/[\\/:*?"<>|]/g, '')
            .replace(/\s+/g, '');
    }
};

// 全局实例
window.volunteerAPI = new VolunteerAPI();
window.utils = Utils;