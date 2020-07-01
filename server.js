const fs = require('fs');
const path = require('path');
const Koa = require('koa');

const app = new Koa();

function rewriteImport (content) {
  return content.replace(/from ['"]([^'"]+)['"]/g, function(s0, s1) {
    if (s1[0] !== '.' && s1[1] !== '/') {
      return `from '/@modules/${s1}'`;
    } else {
      return s0;
    }
  })
}

app.use(async ctx => {
  const { request: {url} } = ctx;

  if (url === '/') {
    ctx.type = 'text/html';
    let content = fs.readFileSync('./index.html','utf-8')
    content = content.replace('<script ',`
      <script>
        window.process = {env:{ NODE_ENV:'dev'}}
      </script>
      <script 
    `)
    ctx.body = content
  } else if (url.endsWith('.js')) {
    const p = path.resolve(__dirname, url.slice(1));
    ctx.type = 'application/javascript';
    const content = fs.readFileSync(p, 'utf-8');
    ctx.body = rewriteImport(content);
  } else if(url.startsWith('/@modules/')){
    // 这是一个node_module里的东西
    const prefix = path.resolve(__dirname,'node_modules',url.replace('/@modules/',''))
    const module = require(prefix+'/package.json').module
    const p = path.resolve(prefix,module)
    const ret = fs.readFileSync(p,'utf-8')
    ctx.type = 'application/javascript'
    ctx.body = rewriteImport(ret)
  }
});

app.listen(3001, () => {
  console.log('program is running in port 3001');
});
