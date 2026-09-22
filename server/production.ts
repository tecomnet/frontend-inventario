// El Lambda SIEMPRE corre como producción, aunque falte NODE_ENV en la
// configuración de la función: así nunca se habilita el login placeholder y
// SESSION_SECRET es obligatorio. Debe importarse antes que config.ts.
process.env.NODE_ENV = 'production';
