export default function buildStart() {
  return {
    name: 'buildStart',
    buildStart(InputOptions) {
      console.log('buildStart', InputOptions);
    }
  };
}
