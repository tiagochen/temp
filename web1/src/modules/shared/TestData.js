export default class TestData {
  /**
   * 根据部门获取用户
   */
  static getUserByDpt(nodeId) {
    let response = {items: []}
    for (let i = 0; i < 5; ++i) {
      let user = {
        user_id: nodeId + '-' + i,
        nick_name: 'd' + i
      }
      response.items.push(user)
    }
    return response
  }

  /**
   * 根据组获取用户
   */
  static getUserByGrp(groupId) {
    let groups = TestData.getGroups()
    let res = null
    groups.forEach(item => item.id === groupId && (res = item))
    return res
  }

  /**
   * 获取组列表
   */
  static getGroups() {
    return [
      {
        'id': '1',
        'name': 'n1',
        'name_short': 'string',
        'name_full': 'string',
        'project_id': 0,
        'remark': 'sdklfajwpioefjapwiejfaiwe',
        'users': [
          {
            'user_id': '123',
            'nick_name': '123'
          },
          {
            'user_id': 'aaa',
            'nick_name': 'bbb'
          }
        ]
      },
      {
        'id': '2',
        'name': 'n2',
        'name_short': 'string',
        'name_full': 'string',
        'project_id': 0,
        'remark': '21sdfawefq23r233',
        'users': []
      },
      {
        'id': '3',
        'name': 'n3',
        'name_short': 'string',
        'name_full': 'string',
        'remark': 'asga43r23423rqf',
        'project_id': 0,
        'users': []
      }
    ]
  }
}
