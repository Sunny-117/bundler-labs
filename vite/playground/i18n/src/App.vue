<template>
  <form>
    <label>{{ t('language') }}</label>
    <select v-model="locale">
      <option value="en">en</option>
      <option value="ja">ja</option>
    </select>
  </form>
  <p>{{ t('hello') }}</p>
</template>

<script setup>
import { computed, getCurrentInstance, ref } from 'vue'
const instance = getCurrentInstance()
function useI18n() {
  const locale = ref('en')
  const i18n = instance.type.i18n
  const t = (msg) => {
    // computed包装一层保留响应式
    return computed(() => i18n[locale.value][msg]).value
  }
  return {
    locale,
    t,
  }
}
const { locale, t } = useI18n()
</script>

<i18n>
{
  "en": {
    "language": "Language",
    "hello": "hello, world!"
  },
  "ja": {
    "language": "言語",
    "hello": "こんにちは、世界！"
  }
}
</i18n>
