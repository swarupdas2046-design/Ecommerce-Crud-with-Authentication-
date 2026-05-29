import multer from 'multer'

const store = multer.memoryStorage()

export const Send_file = multer({storage:store}) 