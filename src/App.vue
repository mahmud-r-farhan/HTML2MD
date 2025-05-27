<template>
  <div class="min-h-screen flex flex-col items-center justify-center p-4 sm:p-6 font-sans">
    <div class="w-full max-w-4xl bg-gray-800 shadow-2xl rounded-xl p-6 sm:p-10" v-auto-animate>
      <header class="mb-8 text-center">
        <h1 class="text-4xl sm:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500 mb-2">
          HTML to Markdown
        </h1>
        <p class="text-gray-400 text-lg">
          Paste your HTML, see the Markdown, and download your `readme.md`!
        </p>
      </header>

      <main class="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
        <div class="flex flex-col space-y-3">
          <label for="htmlInput" class="text-lg font-semibold text-gray-100">HTML Input</label>
          <textarea
            id="htmlInput"
            v-model="htmlInput"
            placeholder="Paste your HTML code here..."
            class="w-full h-64 md:h-96 p-4 bg-gray-700 border border-gray-600 rounded-lg text-gray-200 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-shadow duration-300 resize-none"
            @input="autoConvert"
          ></textarea>
          <div class="flex justify-between mt-2 text-sm text-gray-400">
            <span>{{ characterCount }}/10000</span>
            <span v-if="characterCount > 10000" class="text-red-400">Input too long!</span>
          </div>
        </div>

        <div class="flex flex-col space-y-3">
          <div class="flex justify-between items-center">
            <label for="markdownOutput" class="text-lg font-semibold text-gray-100">Markdown Preview</label>
            <button
              @click="copyToClipboard"
              class="text-sm px-3 py-1 bg-gray-700 hover:bg-gray-600 rounded-md transition-colors"
            >
              {{ copied ? 'Copied!' : 'Copy' }}
            </button>
          </div>
          <div
            id="markdownOutput"
            class="w-full h-64 md:h-96 p-4 bg-gray-700 border border-gray-600 rounded-lg text-gray-200 overflow-auto prose prose-invert max-w-none prose-pre:bg-gray-600 prose-pre:p-3 prose-pre:rounded-md"
          >
            <pre v-if="markdownOutput" class="whitespace-pre-wrap">{{ markdownOutput }}</pre>
            <p v-else class="text-gray-500 italic">Markdown will appear here...</p>
          </div>
        </div>
      </main>

      <div class="mt-6 flex justify-center">
        <div class="bg-gray-700 rounded-lg p-4 max-w-lg">
          <h3 class="text-lg font-semibold mb-2">Conversion Settings</h3>
          <div class="grid grid-cols-2 gap-4">
            <label class="flex items-center space-x-2">
              <input type="checkbox" v-model="options.preserveLinks" class="rounded bg-gray-600">
              <span>Preserve Links</span>
            </label>
            <label class="flex items-center space-x-2">
              <input type="checkbox" v-model="options.preserveImages" class="rounded bg-gray-600">
              <span>Preserve Images</span>
            </label>
          </div>
        </div>
      </div>

      <footer class="mt-8 flex flex-col sm:flex-row justify-center items-center gap-4">
        <button
          @click="convertHtmlToMarkdown"
          class="w-full sm:w-auto px-8 py-3 bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-opacity-75"
        >
          Convert
        </button>
        <button
          @click="downloadMarkdown"
          :disabled="!markdownOutput"
          class="w-full sm:w-auto px-8 py-3 bg-gray-600 hover:bg-gray-500 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-opacity-75 disabled:opacity-50 disabled:transform-none disabled:cursor-not-allowed"
        >
          Download
        </button>
      </footer>
      <p class="text-center text-gray-500 mt-8 text-sm">
        developed by <a href="https://github.com/mahmud-r-farhan" class="text-purple-400 hover:underline" target="_blank" rel="noopener noreferrer">Mahmud R.</a> powered by <a href="https://github.com/mixmark-io/turndown" class="text-purple-300 hover:underline" target="_blank" rel="noopener noreferrer">turndown</a>     
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, computed } from 'vue'
import TurndownService from 'turndown'

const htmlInput = ref('')
const markdownOutput = ref('')
const copied = ref(false)
const options = ref({
  preserveLinks: true,
  preserveImages: true
})

const characterCount = computed(() => htmlInput.value.length)
const turndownService = new TurndownService({
  headingStyle: 'atx',
  hr: '---',
  bulletListMarker: '*',
  codeBlockStyle: 'fenced',
  emDelimiter: '_',
  linkStyle: 'referenced',
  fence: '```',
  preformattedCode: true,
})

const updateRules = () => {
  turndownService.remove('keep-links')
  turndownService.remove('keep-images')

  if (options.value.preserveLinks) {
    turndownService.addRule('keep-links', {
      filter: 'a',
      replacement: (content, node) => {
        const href = node.getAttribute('href')
        return `[${content}](${href})`
      }
    })
  }

  if (options.value.preserveImages) {
    turndownService.addRule('keep-images', {
      filter: 'img',
      replacement: (content, node) => {
        const alt = node.getAttribute('alt') || ''
        const src = node.getAttribute('src') || ''
        return `![${alt}](${src})`
      }
    })
  }
}

watch(options, () => {
  updateRules()
  convertHtmlToMarkdown()
}, { deep: true })

updateRules()

let timeout
const autoConvert = () => {
  clearTimeout(timeout)
  timeout = setTimeout(() => {
    convertHtmlToMarkdown()
  }, 300)
}

const convertHtmlToMarkdown = () => {
  if (htmlInput.value.trim() === '' || characterCount.value > 10000) {
    markdownOutput.value = ''
    return
  }
  try {
    markdownOutput.value = turndownService.turndown(htmlInput.value)
  } catch (error) {
    markdownOutput.value = 'Error converting HTML. Please check your input.'
    console.error('Turndown conversion error:', error)
  }
}

const copyToClipboard = async () => {
  if (!markdownOutput.value) return
  try {
    await navigator.clipboard.writeText(markdownOutput.value)
    copied.value = true
    setTimeout(() => copied.value = false, 2000)
  } catch (err) {
    alert('Clipboard API not supported. Please copy manually.')
    console.error('Failed to copy:', err)
  }
}

const downloadMarkdown = () => {
  if (!markdownOutput.value) return
  const blob = new Blob([markdownOutput.value], { type: 'text/markdown;charset=utf-8' })
  const link = document.createElement('a')
  link.href = URL.createObjectURL(blob)
  link.download = 'readme.md'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(link.href)
}
</script>

<style scoped>
.prose :where(code):not(:where([class~="not-prose"] *))::before {
  content: "";
}
.prose :where(code):not(:where([class~="not-prose"] *))::after {
  content: "";
}
</style>