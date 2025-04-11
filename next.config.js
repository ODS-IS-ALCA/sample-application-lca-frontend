/** @type {import('next').NextConfig} */

//バージョンファイルを作成（バージョン管理対象外）
const fs = require('fs');
const data = fs.readFileSync('package.json', 'utf8');
const pkg = JSON.parse(data);
const file = fs.writeFileSync('public/version.txt', pkg.version);

const nextConfig = {
  output: 'export',
  trailingSlash: true,
  eslint: {
    dirs: ['api/', 'app/', 'components/', 'lib/'],
  },
};

module.exports = nextConfig;
