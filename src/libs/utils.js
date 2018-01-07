export default {
  toast (title = '保存成功', icon = 'success', duration = 2000) {
    return new Promise((resolve, reject) => {
      wx.showToast({
        title,
        icon,
        duration,
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
        title: opt.title || '',
        content: opt.content || '提示内容',
        showCancel: opt.showCancel || false,
        confirmColor: '#3EC041',
        success (res) {
          resolve(res)
        },
        fail (error) {
          reject(error)
        }
      })
    })
  },
  
  downFile(url) {
    return new Promise((resolve, reject) => {
      wx.downloadFile({
        url,
        success(res) {
          resolve(res.tempFilePath)
        }
      })
    })
  },
  
  getLocalImg(path) {
    return new Promise((resolve, reject) => {
      wx.getImageInfo({
        src: path,
        success: function (res) {
          console.log(res)
          resolve(res)
        }
      })
    })
  },
  
  drawCanvas(screenRect, detail, callback) {
    let width = screenRect.width - 20
    let height = screenRect.height
    let context = wx.createCanvasContext('firstCanvas')
    let drawType = detail.setType || 2
    let imgW = width
    let imgH = drawType === 1 ? 200 : height - 150
    let hasImg = Boolean(detail.talkImg[0])
    let utils = this
  
    function _drawWorld(context, text) {
      let startX, startY, middleX, middleY
      let brNum = 0
      let colWidth = 20
      let rowWidth = 14
    
      context.setFillStyle('black')
      context.setFontSize(14)
    
      // 横向排列的文本需要手动计算宽度
      // 手动换行
      let newText = ''
      let previousIndex = 0
      for (let i = 0; i < text.length; i++) {
        newText += text[i]
        if (rowWidth * (i - previousIndex + 1) / (width - 20) > 1) {
          newText += '\n'
          previousIndex = i
        }
      }
      text = newText
      
      // 得到换行后的文本
      text = text.split('\n')
      // 初始的x轴坐标是根据换行数来确定
      middleX = imgW / 2 + colWidth * (text.length + 1) / 2
    
      text.forEach((textItem, colIndex)=> {
        brNum += 1
        
        if (drawType === 1) {
          // 每一列起始的x轴坐标
          startX = middleX - brNum * colWidth
          // 每一列起始的y坐标
          middleY = hasImg ? (imgH + colWidth*3) : imgH / 2
  
          if (colIndex === 0) {
            // 第一列加上小红圈
            context.arc(startX + 7, middleY - 5, 3, 0, 2 * Math.PI)
            context.setStrokeStyle('red')
            context.stroke()
            // 将第一列起始y坐标加上小红圈的高度
            middleY = middleY + colWidth
          }
        } else {
          middleX = 10
          startY = middleY = (hasImg ? (imgH + 20) : 100) + brNum * colWidth
        }
      
        for (let i = 0; i < textItem.length; i++) {
          if (drawType === 1) {
            // 每一个文字的起始y坐标
            startY = middleY + colWidth*i
          } else {
            startX = middleX + rowWidth*i
          }
          
          context.fillText(textItem[i], startX, startY)
        }
      })
    }
  
    function _drawAvatar(context) {
      let avatarW = 50
      let avatarX = 10
      let avatarXEnd = screenRect.width - 10 - avatarW
      let avatarY = screenRect.height
      let worldY = avatarY - avatarW / 2 - 5
    
      context.setFontSize(10)
      context.setFillStyle('#aaaaaa')
    
      // slogan
      // context.fillText('小心情', avatarXEnd - 40, worldY)
    
      // logo
      context.drawImage(
        // detail.user.avatarUrl,
        '../libs/image/code.jpg',
        avatarXEnd,
        avatarY - avatarW - 10,
        avatarW,
        avatarW
      )
      
      // avatar
      // context.drawImage(
      //   detail.user.avatarUrl,
      //   avatarX,
      //   avatarY - avatarW + 10,
      //   avatarW - 20,
      //   avatarW - 20
      // )
      // nickName
      context.fillText(
        `来自@${detail.user.nickName} - 小程序[小心情]`,
        avatarX,
        // avatarX + avatarW -10,
        worldY + 20
      )
    }
    
    function _saveToImage() {
      utils.loading('正在生成图片...')
      setTimeout(()=> {
        wx.canvasToTempFilePath({
          width: screenRect.width,
          height: screenRect.height,
          canvasId: 'firstCanvas',
          success(res) {
            callback && callback()
            utils.loading(true)
            setTimeout(()=> {
              wx.saveImageToPhotosAlbum({
                filePath: res.tempFilePath,
                success() {
                  utils.toast('保存图片成功!')
                }
              })
            }, 100)
          }
        })
      }, 1000)
    }
  
    context.setFillStyle('#fafafa')
    context.fillRect(0, 0, screenRect.width, height)
  
    _drawWorld(context, detail.talkContent)
  
    // 异步获取图片
    _drawAvatar(context)
  
    if (hasImg) {
      this.modal({
        showCancel: true,
        content: '本应用使用的图片服务是http的，小程序不支持直接生成，需手动选择'
      }).then(()=> {
        wx.chooseImage({
          success(res) {
            context.drawImage(res.tempFilePaths[0], 10, 10, imgW, imgH)
            context.draw()
            _saveToImage()
          }
        })
      })
    } else {
      context.draw()
      _saveToImage()
    }
  }
}
