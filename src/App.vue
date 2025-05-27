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
        </div>

        <div class="flex flex-col space-y-3">
          <label for="markdownOutput" class="text-lg font-semibold text-gray-100">Markdown Preview</label>
          <div
            id="markdownOutput"
            class="w-full h-64 md:h-96 p-4 bg-gray-700 border border-gray-600 rounded-lg text-gray-200 overflow-auto prose prose-invert max-w-none prose-pre:bg-gray-600 prose-pre:p-3 prose-pre:rounded-md"
          >
            <pre v-if="markdownOutput" class="whitespace-pre-wrap">{{ markdownOutput }}</pre>
            <p v-else class="text-gray-500 italic">Markdown will appear here...</p>
          </div>
        </div>
      </main>

      <footer class="mt-8 flex flex-col sm:flex-row justify-center items-center gap-4">
        <button
          @click="convertHtmlToMarkdown"
          class="w-full sm:w-auto px-8 py-3 bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-opacity-75"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 inline-block mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 101.414 1.414L9 9.414V13a1 1 0 102 0V9.414l1.293 1.293a1 1 0 001.414-1.414z" clip-rule="evenodd" />
          </svg>
          Convert
        </button>
        <button
          @click="downloadMarkdown"
          :disabled="!markdownOutput"
          class="w-full sm:w-auto px-8 py-3 bg-gray-600 hover:bg-gray-500 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-opacity-75 disabled:opacity-50 disabled:transform-none disabled:cursor-not-allowed"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 inline-block mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clip-rule="evenodd" />
          </svg>
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
import { ref, watch } from 'vue'
import TurndownService from 'turndown'

const htmlInput = ref('')
const markdownOutput = ref('')
const turndownService = new TurndownService({
  headingStyle: 'atx', 
  hr: '---', 
  bulletListMarker: '*',
  codeBlockStyle: 'fenced', 
  emDelimiter: '_', 
});

const convertHtmlToMarkdown = () => {
  if (htmlInput.value.trim() === '') {
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

const autoConvert = () => {
  convertHtmlToMarkdown();
}
watch(htmlInput, () => {
});

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