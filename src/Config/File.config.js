import multer from 'multer'
//----- Multer Config -----
const store = multer.memoryStorage()
//----- Multer Middleware -----
export const Send_file = multer({storage:store}) 