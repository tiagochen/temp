const s = process.versions
const nodeVersion = s.node.split('.')[0]
if (nodeVersion < 6) {
  throw new Error('You are running Node ' + s.node + '.\nThis project requires Node 6 or higher. \nPlease update your version of Node.')
}
