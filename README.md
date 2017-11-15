## Vue的api跨域请求问题

使用vue做跨域请求的时候的基本操作是
```javascript

// config/index.js
module.exports = {
  // ...
  dev: {
    proxyTable: {
      // proxy all requests starting with /api to jsonplaceholder
      '/api/**': {
        target: 'http://jsonplaceholder.typicode.com',
        changeOrigin: true,
        pathRewrite: {
          '^/api' :'/'
        }
      }
    }
  }
}
```
(详情见：[https://vuejs-templates.github.io/webpack/proxy.html](https://vuejs-templates.github.io/webpack/proxy.html))

相当于开发环境下的``'/api'``路由是指向xxx.com地址的,同时重定向了你的路由所有带``'/api'``的都是空，即用axios请求数据的时候控制台里看到的其实并没有``/api``这四个字符。``changeOrigin:true``则会自动给请求头加入Host首部。

**但是这个时候就会有一个问题，即一旦项目中的路由一多起来，难免会出现路由的冲突问题，并且上面这个常规操作只是让浏览器认为它没有``'/api'``这个字符，我们码畜还得自己手码啊！每次多打四个字多费时间啊！于是为了懒，我们就要找稍微高端点的操作了！**

整一个变量，让这个变量代替``'/api'``，那tm不就少打字了吗？于是在入口文件引入axios的时候同时把这个变量定下来：
```javascript

// main.js

import axios from "axios"

axios.defaults.baseURL = 'api'
```
好了，这个时候再请求数据的时候就可以少打四个字了。

同样的，这里还是会存在一个弊端，那就算不能区分到底是生产环境还是开发环境。那么为了区分这个情况，我们在config目录下新建一个api.config.js文件来区分它。

```javascript

const isPro = Object.is(process.env.NODE_ENV, 'production')

module.exports = {
  baseURL: isPro ? 'http://jsonplaceholder.typicode.com/api/' :'api/'
}
```
有了这个文件以后，再在入口文件里用它。
```javascript

// main.js
import Vue from 'vue'
import App from './App'
import router from './router'
import axios from "axios"

import apiConfig from '../config/api.config'
axios.defaults.baseURL = apiConfig.baseURL
```

这样就一劳永逸啦！
