import { open } from '@tauri-apps/plugin-dialog'
import { BaseDirectory, readTextFile } from '@tauri-apps/plugin-fs'

const selected = await open({
  multiple: false,
  filters: [
    {
      name: 'text',
      extensions: ['txt'],
    },
    {
      name: 'All',
      extensions: ['*'],
    },
  ],
})
console.log(selected)

// ファイルの読み込み処理を追加
const text = await readTextFile(selected, { baseDir: BaseDirectory.AppConfig })
console.log(text)