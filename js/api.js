// API工具函数
class VolunteerAPI {
    constructor() {
        this.baseURL = window.API_BASE_URL;
        this.timeout = 30000; // 30秒超时
    }

    // 带超时的fetch请求
    async fetchWithTimeout(url, options = {}) {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), this.timeout);
        
        try {
            const response = await fetch(url, {
                ...options,
                signal: controller.signal
            });
            clearTimeout(timeoutId);
            return response;
        } catch (error) {
            clearTimeout(timeoutId);
            if (error.name === 'AbortError') {
                throw new Error('请求超时，请检查网络连接');
            }
            throw error;
        }
    }

    // 通用请求方法
    async request(endpoint, options = {}) {
        const url = `${this.baseURL}${endpoint}`;
        const defaultOptions = {
            headers: {
                'Content-Type': 'application/json',
            },
            mode: 'cors', // 明确指定CORS模式
            credentials: 'omit' // 移动端不发送凭据，避免CORS问题
        };

        const config = { ...defaultOptions, ...options };

        try {
            console.log(`🚀 API请求: ${url}`);
            console.log(`📱 用户代理: ${navigator.userAgent}`);
            console.log(`🌐 请求配置:`, config);
            
            const response = await this.fetchWithTimeout(url, config);
            
            console.log(`📡 响应状态: ${response.status} ${response.statusText}`);
            console.log(`📋 响应头部:`, Object.fromEntries(response.headers.entries()));
            
            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                const errorMsg = errorData.error || `HTTP ${response.status}: ${response.statusText}`;
                console.error(`❌ API错误: ${errorMsg}`);
                throw new Error(errorMsg);
            }

            const data = await response.json();
            console.log(`✅ API响应成功:`, data);
            return data;
        } catch (error) {
            console.error('❌ API请求失败:', error);
            
            // 提供更友好的错误信息
            let userMessage = '网络请求失败';
            if (error.message.includes('timeout') || error.message.includes('超时')) {
                userMessage = '请求超时，请检查网络连接';
            } else if (error.message.includes('Failed to fetch')) {
                userMessage = '无法连接到服务器，请检查网络连接或尝试刷新页面';
            } else if (error.message.includes('CORS')) {
                userMessage = '跨域请求被阻止，请联系管理员';
            } else if (error.message.includes('certificate') || error.message.includes('SSL')) {
                userMessage = 'SSL证书错误，请检查网络设置';
            }
            
            // 在移动端显示更详细的错误信息
            if (/Mobile|Android|iPhone|iPad/.test(navigator.userAgent)) {
                alert(`移动端错误详情:\n${error.message}\n\n建议: ${userMessage}`);
            }
            
            throw new Error(userMessage);
        }
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
    }
};

// 全局实例
window.volunteerAPI = new VolunteerAPI();
window.utils = Utils;