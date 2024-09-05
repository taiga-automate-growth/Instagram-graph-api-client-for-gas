class InstagramGraphApiClient{
    /**
     * @constructor
     * @param {string} instagramId - インスタグラムアカウントのID
     * @param {string} accessToken - Graph APIのアクセストークン
     */
    constructor(instagramId,accessToken){
        /**
         * @private;
         * @type {string}
         */
        this.id = instagramId;
        /**
         * @private
         * @type {string}
         */
        this.accessToken = accessToken;
        /**
         * @private
         * @type {string}
         */
        this.apiVersion = 'v20.0';
        /**
         * @private
         * @type {string}
         */
        this.baseUrl = `https://graph.facebook.com/${this.apiVersion}`;
    }

    /**
     * すべてのフィード、リールを取得する
     * 
     * @param {boolean} caption - 投稿の説明文を取得する場合はtrue、それ以外はfalse
     * @param {boolean} mediaUrl - 投稿のURLを取得する場合はtrue、それ以外はfalse
     * @param {boolean} mediaType - 投稿の種別を取得する場合はtrue、それ以外はfalse
     * @param {boolean} permalink - 投稿のパーマリンクを取得する場合はtrue、それ以外はfalse
     * @param {boolean} thumnailUrl - 投稿のサムネイルURLを取得する場合はtrue、それ以外はfalse
     * @param {boolean} timestamp - 投稿のタイムスタンプを取得する場合はtrue、それ以外はfalse
     * @param {boolean} username - 投稿のユーザー名を取得する場合はtrue、それ以外はfalse
     * @param {string} startDate - 取得開始日 yyyy/MM/dd形式 ここで指定した日付以降の投稿のみ取得する 指定しない場合は''とする
     * @param {string} endDate - 取得終了日 yyyy/MM/dd形式 ここで指定した日付以前の投稿のみ取得する 指定しない場合は''とする
     */
    getMedias(caption = false, mediaUrl = false, mediaType = false, permalink = false, thumnailUrl = false, timestamp = false, username = false, startDate = '', endDate = ''){
        let endpoint = `${this.baseUrl}/${this.id}/media?fields=id%2C`;
        if(caption){
            endpoint += `caption%2C`;
        }

        if(mediaUrl){
            endpoint += `media_url%2C`;
        }

        if(thumnailUrl){
            endpoint += `thumbnail_url%2C`;
        }

        if(permalink){
            endpoint += `permalink%2C`;
        }

        if(mediaType){
            endpoint += `media_type%2C`;
        }

        if(timestamp){
            endpoint += `timestamp%2C`;
        }

        if(username){
            endpoint += `username`;
        }

        if(startDate !== ''){

            let since = new Date(startDate);
            
            if(Number.isNaN(since)) throw new Error('取得開始日はyyyy/MM/ddのみ指定できます');
            since = since.getTime();
            endpoint += `&since=${since}`;
        }
        
        if(endDate !== ''){

            let until = new Date(endDate);
            if(Number.isNaN(until)) throw new Error('取得終了日はyyyy/MM/ddのみ指定できます');
            until = until.getTime();
            endpoint += `&until=${until}`;
        }
        
        endpoint += `&access_token=${this.accessToken}`;

        const params = {
            muteHttpExceptions: true
        }

        const response = UrlFetchApp.fetch(endpoint, params);
        const responseCode = response.getResponseCode();
        const contents = response.getContentText();

        if(responseCode === 200){
            const medias = JSON.parse(contents).data;
            return medias;
        }

        throw new Error(`エラーコード:${responseCode}\n${contents}`)

    }
}