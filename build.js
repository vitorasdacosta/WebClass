const esbuild = require('esbuild');

const isWatch = process.argv.includes('--watch');

const options = {
  entryPoints: ['main.tsx'],
  bundle: true,
  outfile: 'app.js',
  minify: !isWatch,
  sourcemap: true,
  target: ['es2020'],
  define: {
    'process.env.NODE_ENV': isWatch ? '"development"' : '"production"'
  }
};

if (isWatch) {
  esbuild.context(options).then(ctx => {
    return ctx.watch();
  }).then(() => {
    console.log('[WebClass] Modo observação ativado! Compilando alterações automaticamente...');
  }).catch(err => {
    console.error(err);
    process.exit(1);
  });
} else {
  esbuild.build(options).then(() => {
    console.log('Build finalizado com sucesso! app.js gerado.');
  }).catch((err) => {
    console.error(err);
    process.exit(1);
  });
}
