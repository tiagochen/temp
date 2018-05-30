/*eslint no-console:0 */
// npm 参数
const args = require('minimist')(process.argv.slice(2));
// 文件操作组件，含json操作
const fs = require('fs-extra');
// zip操作组件
const JSZip = require('jszip');
// 当前环境配置
const configEnv = require('./src/config')
// 项目npm配置信息
const packageObj = require('./package.json')
// 引入语言包入口文件，根据facMapOptions配置生成，本项目的入口是src/i18n/modules/index.js
const pathModulesMap = 'src/i18n/modules/'
// 翻译平台和项目及项目组件映射配置
const facMapOptions = fs.readJsonSync(pathModulesMap + 'facMap.json')
// 项目语言存放目录
const pathDefault = 'src/i18n/locales/'
// 默认语言
const langDefault = 'zh-CN'
// 翻译平台上传资源版本号名称
const versionFileName = 'version.txt'
// api访问组件
const axios = require('axios')

if(!packageObj.needFac){
  console.log('翻译平台对接功能处于关闭状态，如需开启，请查阅readme.md，配置 package.json 中的 needFac 为 true。了解更多翻译平台的功能，请参考：http://reference.sdp.nd/appfactory/editor-guide/translate/web-translate/')
  return 
}
// 下载翻译平台语言包,并导入项目指定文件夹中
function importZip(packageUrl, resourceNname) {
  return new Promise(function (resolve, reject) {
    axios.get(packageUrl, {responseType: 'stream'})
      .then(function (resItemLangData) {
        resItemLangData.data.pipe(fs.createWriteStream(resourceNname + '.zip'))
          .on('finish', function () {
            fs.readFile(resourceNname + '.zip', function (err, data) {
              if (err) throw err;
              JSZip.loadAsync(data)
                .then(function (zip) {
                  let lengthAll = 0;
                  let countNow = 0;
                  zip.forEach(function (relativePath, file) {
                    lengthAll++
                    if (relativePath !== versionFileName) {
                      let pathItem = [pathDefault, resourceNname, '/', relativePath].join('')
                      fs.ensureFileSync(pathItem)
                      file.nodeStream()
                        .pipe(fs.createWriteStream(pathItem))
                        .on('finish', function () {
                          countNow++;
                          if (countNow === lengthAll) {
                            resolve(true)
                          }
                          console.log(['导入语言包成功：', pathItem].join(''));
                        });
                    } else {
                      countNow++;
                      if (countNow === lengthAll) {
                        resolve(true)
                      }
                    }
                  });
                })
            });
          })
      })
  })
}
try {
  if (args.action === 'export') {
    //按翻译平台的格式导出默认语言压缩包
    let zip = new JSZip();
    const files = fs.readdirSync(pathDefault + langDefault)
    //遍历默认语言包下的所有文件,并压缩文件
    files.forEach(function (filesItem) {
      zip.file(filesItem, JSON.stringify(fs.readJsonSync([pathDefault, langDefault, filesItem].join('/'))))
    })
    //生成含facVersion的txt文件,并压缩文件
    zip.file(versionFileName, packageObj.facVersion)
    zip
      .generateNodeStream({streamFiles: true, compression: "DEFLATE"})
      .pipe(fs.createWriteStream(langDefault + '.zip'))
      .on('finish', function () {
        console.log('导出默认语言包成功：./' + langDefault + '.zip')
      })
      .on('error', function (error) {
        console.log('导出默认语言包失败：')
        console.error(error)
      });

  } else if (args.action === 'import') {
    // 从翻译平台上获取已经发布的语言，导入到项目指定文件夹中，并引用
    if (!configEnv.build.env.base_url_fac) {
      console.error('config缺少base_url_fac配置！')
      return
    }
    // 从翻译平台上获取指定版本已经发布的语言
    axios.get([configEnv.build.env.base_url_fac, '/v0.1/default/com.nd.sdp.web/', packageObj.name, '/web/web/archive?version=', packageObj.facVersion].join(''))
      .then(function (responseData) {
        console.log(['项目名称为：', packageObj.name, '在', configEnv.build.env.base_url_fac, '有', responseData.data.length, '个语言包，含默认的中文。'].join(''))
        // 根据facMap.json动态生成require代码，require.context满足不了需求
        console.log('更新require引用文件开始...');
        for (let [kModule, vModule] of Object.entries(facMapOptions)) {
          let langContent = [];
          let facLangList = responseData.data
          //如果翻译平台找不到语言包，加入默认的中文
          if (facLangList.length === 0) {
            facLangList.push({resource_name: langDefault})
          }
          facLangList.forEach(function (itemLangData) {
            let langNow = vModule.facMap[itemLangData.resource_name];
            // 如果配置成空,则使用组件默认语言库{}
            if (langNow === '') {
              langContent.push(["exports['", itemLangData.resource_name, "'] = {}\n"].join(''));
            } else {
              // 如果没有配置映射，则组件的key当做和翻译平台一致
              langNow = langNow ? langNow : itemLangData.resource_name
              langContent.push(["exports['", itemLangData.resource_name, "'] = require('", vModule.prefixPath, langNow, (vModule.suffixPath ? vModule.suffixPath : ''), "')\n"].join(''));
            }
          })
          fs.outputFileSync([pathModulesMap, kModule, '.js'].join(''), langContent.join(''))
          console.log('更新require引用文件成功:', [pathModulesMap, kModule, '.js'].join(''));
        }
        console.log('更新require引用文件结束...');
        // 排除中文导入所有已发布语言
        responseData.data.forEach(function (itemLangData) {
          if (itemLangData.resource_name !== langDefault && itemLangData.package_url) {
            // 下载翻译平台语言包,并导入项目指定文件夹中
            console.log(itemLangData.resource_name, '导入语言包开始...');
            importZip(itemLangData.package_url, itemLangData.resource_name)
              .then(function () {
                fs.removeSync(itemLangData.resource_name + '.zip')
                console.log(itemLangData.resource_name, '导入语言包结束...');
              })
          }
        })

      }, function (error) {
        console.error(error)
      })

  } else {
    console.log('无效的action参数')
  }
} catch (error) {
  console.log('不可预期的异常：')
  console.error(error)
}
