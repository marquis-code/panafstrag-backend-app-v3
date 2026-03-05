import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { v2 as cloudinary, UploadApiResponse, UploadApiErrorResponse } from 'cloudinary';

@Injectable()
export class MediaService {
  constructor(private configService: ConfigService) {
    cloudinary.config({
      cloud_name: this.configService.get<string>('CLOUDINARY_CLOUD_NAME'),
      api_key: this.configService.get<string>('CLOUDINARY_API_KEY'),
      api_secret: this.configService.get<string>('CLOUDINARY_API_SECRET'),
    });
  }

  async uploadFile(
    file: Express.Multer.File,
    folder: string = 'panafstrag',
  ): Promise<UploadApiResponse | UploadApiErrorResponse> {
    const isPDF = file.mimetype === 'application/pdf';
    const isImage = file.mimetype.startsWith('image/') || isPDF;
    
    // Minimal options to avoid 401/403 errors on strict Cloudinary accounts
    const options: any = { 
      folder: folder, 
      resource_type: isPDF ? 'image' : 'auto',
      access_mode: 'public',
      type: 'upload', // Explicitly public "upload" type
      use_filename: true,
      unique_filename: true,
    };

    if (isImage && !isPDF) {
      options.transformation = [
        { quality: 'auto', fetch_format: 'auto' },
        { width: 1200, crop: 'limit' }
      ];
    }

    console.log(`[Media] Uploading ${file.originalname} (${file.mimetype}) with resource_type: ${options.resource_type}`);

    return new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        options,
        (error, result) => {
          if (error) {
            console.error('[Media] Cloudinary Upload Error:', error);
            return reject(error);
          }
          if (!result) return reject(new Error('Cloudinary upload failed'));
          
          console.log('[Media] Cloudinary Upload Success:', result.secure_url);
          resolve(result);
        },
      ).end(file.buffer);
    });
  }
}
