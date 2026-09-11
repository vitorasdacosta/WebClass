const esbuild = require('esbuild');

esbuild.build({
  entryPoints: ['main.tsx'],
  bundle: true,
  outfile: 'app.js',
  minify: true,
  sourcemap: true,
  target: ['es2020'],
  define: {
    'process.env.NODE_ENV': '"production"'
  }
}).then(() => {
  console.log('Build finalizado com sucesso! app.js gerado.');
}).catch((err) => {
  console.error(err);
  process.exit(1);
});
