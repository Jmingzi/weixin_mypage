import AV from './av-weapp-min.js'
import utils from './utils'



export default {
    user: null,
    
    openid: 0,
    
    setTableContent () {
        const Content = AV.Object.extend('content')
        return new Content()
    },
    
    commonField () {
        return {
            user: this.user,
            openid: this.openid
        }
    },
    
    queryBy (dataType, isOwn = true) {
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
    
        query.descending('createdAt')
        return query.find()
    },
    
    queryById (id) {
        return new AV.Query('content').get(id)
    }
}
