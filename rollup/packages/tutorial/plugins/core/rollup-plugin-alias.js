function matches(pattern, importee) {
  if (pattern instanceof RegExp) {
    return pattern.test(importee);
  }
  if (importee.length < pattern.length) {
    return false;
  }
  if (importee === pattern) {
    return true;
  }
  return importee.startsWith(pattern + '/');
}

function alias(options = {}) {
  const { entries } = options;
  if (entries.length === 0) {
    return {
      name: 'alias',
      resolveId: () => null
    };
  }
  return {
    name: 'alias',
    resolveId(importee, importer) {
      if (!importer) {
        return null;
      }
      const matchedEntry = entries.find((entry) => matches(entry.find, importee));
      if (!matchedEntry) {
        return null;
      }
      const updatedId = importee.replace(matchedEntry.find, matchedEntry.replacement);
      //调用this.resolve意味着重新解析
      return this.resolve(updatedId, importer, Object.assign({ skipSelf: true }))
        .then((resolved) => resolved || { id: updatedId });
    }
  };
}
export default alias;
