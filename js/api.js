// API工具函数
class VolunteerAPI {
    constructor() {
        this.baseURL = window.API_BASE_URL;
    }

    // 通用请求方法
    async request(endpoint, options = {}) {
        const url = `${this.baseURL}${endpoint}`;
        const defaultOptions = {
            headers: {
                'Content-Type': 'application/json',
            },
        };

        const config = { ...defaultOptions, ...options };

        try {
            const response = await fetch(url, config);
            
            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.error || `HTTP ${response.status}: ${response.statusText}`);
            }

            return await response.json();
        } catch (error) {
            console.error('API请求失败:', error);
            throw error;
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