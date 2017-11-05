export default {
    toast (title = '保存成功', icon = 'success') {
        return new Promise((resolve, reject) => {
            wx.showToast({
                title,
                icon,
                duration: 2000,
                mask: true,
                success () {
                    setTimeout(() => {
                        resolve()
                    }, 2000)
                },
                fail (error) {
                    reject(error)
                }
            })
        })
    },
    
    loading (title = '加载中') {
        if (typeof title === 'boolean') {
            wx.hideLoading()
        } else {
            wx.showLoading({ title })
        }
    },
    
    modal (opt = {}) {
        return new Promise((resolve, reject) => {
            wx.showModal({
                title: opt.title || '提示',
                content: opt.content || '提示内容',
                showCancel: opt.showCancel || false,
                confirmColor: '#FC9153',
                success () {
                    resolve()
                },
                fail (error) {
                    reject(error)
                }
            })
        })
    }
}
