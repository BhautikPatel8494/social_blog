import { HttpException, HttpStatus } from '@nestjs/common';
import { extname } from 'path';
import { diskStorage } from 'multer';
import { existsSync, mkdirSync } from 'fs';

const fileExtensions = {
    image: ['jpg', 'jpeg', 'png'],
};

// Multer upload options
export const multerUpload = ({ destination, type = 'image' }) => {
    destination = `./upload/${destination}`;
    return {
        fileFilter: (req: any, file: any, cb: any) => {
            const fileNamesArray = file.originalname.split('.');
            let extension: any = fileNamesArray[fileNamesArray.length - 1];
            extension = extension.toLowerCase();
            const extensionTypes = fileExtensions[type];
            if (extensionTypes.indexOf(extension) > -1) {
                cb(null, true);
            } else {
                cb(new HttpException(`Unsupported file type ${extname(file.originalname)}`, HttpStatus.BAD_REQUEST), false);
            }
        },
        // Storage properties
        storage: diskStorage({
            destination: (req: any, file: any, cb: any) => {
                const uploadPath = destination;
                if (!existsSync(uploadPath)) {
                    mkdirSync(uploadPath);
                }
                cb(null, uploadPath);
            },
            // File modification details
            filename: (req: any, file: any, cb: any) => {
                const extArray = file.originalname.split('.');
                const extension = extArray[extArray.length - 1];
                const fileName = extArray[0];
                cb(null, file.fieldname + '-' + fileName + '-' + Date.now() + '.' + extension);
            },
        }),
    };
};