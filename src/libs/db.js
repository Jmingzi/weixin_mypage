import AV from './av-weapp-min.js'
import utils from './utils'



export default {
    user: null,
    
    openid: 0,
    
    setTableContent () {
        const Content = AV.Object.extend('content')
        return new Content()
    },
    
    setComment () {
        const Comment = AV.Object.extend('comment')
        return new Comment()
    },
    
    commonField () {
        return {
            user: this.user,
            openid: this.openid
        }
    },
    
    getOneTalk (id) {
        return AV.Object.createWithoutData('content', id)
    },
    
    queryBy (dataType, isOwn = true, limit, limitCondition) {
        let queryContent
        let queryContent2
        let query
        
        if (dataType) {
            queryContent = new AV.Query('content')
            queryContent.equalTo('dataType', dataType)
            query = queryContent
        }
        
        if (isOwn) {
            queryContent2 = new AV.Query('content')
            queryContent2.equalTo('openid', this.openid)
            query = queryContent2
        }
        
        if (dataType && isOwn) {
            query = AV.Query.and(queryContent, queryContent2)
        }
        
        if (limit) {
            query.lessThanOrEqualTo('createdAt', limitCondition)
            query.limit(limit)
        }
    
        query.descending('createdAt')
        return query.find()
    },
    
    queryById (id) {
        return new AV.Query('content').get(id)
    },
    
    queryByArray (arr) {
        arr = arr.map(id => '"' + id + '"')
        let sql = 'select * from comment where contentId in (' + arr.join(',') + ')'
        return AV.Query.doCloudQuery(sql)
    },
    
    delContentById (id) {
        const talk = AV.Object.createWithoutData('content', id)
        return talk.destroy()
    },
    
    delComment (id) {
        const comment = AV.Object.createWithoutData('comment', id)
        return comment.destroy()
    },
    
    delCommentById (id) {
        return new Promise((resolve, reject) => {
            AV.Query.doCloudQuery('select * from comment where contentId="'+ id +'"').then(res => {
                const Objects = res.results.map(item => {
                    return AV.Query.doCloudQuery('delete from comment where objectId="'+ item.id +'"')
                })
        
                AV.Object.saveAll(Objects).then(() => {
                    resolve()
                }).catch(() => {
                    reject()
                })
            }).catch(() => {
                reject()
            })
        })
    }
}
