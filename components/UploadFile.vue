<template>
  <div
    v-cloak
    @drop.prevent="addFile"
    @dragover.prevent
    class="border-gray-500 border-dashed border-4 p-4"
  >
    <h2>Files to Upload (Drag them over)</h2>
    <ul>
      <li v-for="file in files">
        {{ file.name }} ({{ file.size | kb }} kb)
        <button @click="removeFile(file)" title="Remove">X</button>
      </li>
    </ul>

    <button :disabled="uploadDisabled" @click="upload">Upload</button>
  </div>
</template>

<script>
export default {
  name: 'UploadFile',
  filters: {
    kb: (val) => {
      return Math.floor(val / 1024)
    }
  },
  props: {
    logo: {
      type: String,
      default: ''
    },
    text: {
      type: String,
      default: ''
    },
    disabled: {
      type: Boolean,
      default: false
    },
    applyClasses: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      files: []
    }
  },
  computed: {
    uploadDisabled() {
      return this.files.length === 0
    }
  },
  methods: {
    addFile(e) {
      const droppedFiles = e.dataTransfer.files
      if (!droppedFiles)
        return // this tip, convert FileList to array, credit: https://www.smashingmagazine.com/2018/01/drag-drop-file-uploader-vanilla-js/
      ;[...droppedFiles].forEach((f) => {
        this.files.push(f)
      })
    },
    removeFile(file) {
      this.files = this.files.filter((f) => {
        return f !== file
      })
    },
    upload() {
      const formData = new FormData()
      this.files.forEach((f, x) => {
        formData.append('file' + (x + 1), f)
      })

      fetch('https://httpbin.org/post', {
        method: 'POST',
        body: formData
      })
        .then((res) => res.json())
        .then((res) => {
          console.log('done uploading', res)
        })
        .catch((e) => {
          console.error(JSON.stringify(e.message))
        })
    }
  }
}
</script>

<style scoped></style>
