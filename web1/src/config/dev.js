const config = {
  localKey: 'localhost',      // 本地
  devKey: '.dev.web.nd',      // 开发
  debugKey: '.debug.web.nd',  // 测试
  betaKey: '.beta.101.com',   // 预生产
  prodKey: '.sdp.101.com',    // 生产
  awsKey: '.aws.101.com',     // 新加坡
  awscaKey: '.awsca.101.com', // 加利福尼亚
  gatewayHost: 'user-select-gateway'
}

config.appEnv = 'localhost'
config.gateway = ''

config.mapKey = {
  'uc.server.path': 'ucApi',
  'elearning.uc-sdk.avatar.path': 'ucAvatar',
  'elearning.statistics.service.url': 'staticService', // UserInput组件，用于获取用户信息
  'elearning.service.url': 'elearningService' // 组织树
}

config.appFactorTranslateApi = '/api-app-factory-translate'
config.appLangApi = '/api-cs-101-com'
config.appName = 'user-select-gateway'
config.cnPack = 'zh-CN'
config.appLangKey = 'languages.translation.admin'
config.appLangCommonKey = 'languages.translation.common'
config.mapKey['languages.translation.admin'] = 'appLangKey'
config.mapKey['languages.translation.common'] = 'appLangCommonKey'

export default config
