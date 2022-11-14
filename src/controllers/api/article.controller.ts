import { Body, Controller, Delete, Param, Patch, Post, Req, UploadedFile, UseInterceptors } from "@nestjs/common";
import { Crud } from "@nestjsx/crud";
import { ArticleService } from "../../services/articles/article.service";
import { Article } from "../../../entities/Article";
import { AddArticleDto } from "../../dtos/article/add.article.dto";
import { ApiResponse } from "../../mlnsc/api/response.class";
import { FileInterceptor } from "@nestjs/platform-express";
import { StorageConfig} from "../../../config/storage.config";
import { diskStorage} from "multer";
import { PhotoService } from "../../services/photo/photo.service";
import { Photo } from "../../../entities/Photo";
import * as  filetype2 from "file-type"
import filetype from 'magic-bytes.js'
import * as fs from 'fs';
import * as sharp from 'sharp';
import { readFileSync } from "fs";
import * as os from 'os';
import extname from "path";
import { fileTypeFromFile } from "file-type";
import { EditArticleDto } from "../../dtos/article/edit.article.dto";

@Controller('api/article')
@Crud({
  model:{
    type: Article
  },
  params:{
    id:{
      field:'articleId',
      type:'number',
      primary:true
    }
  },
  query:{
    join:{
        category:{
          eager:true
        },
        photos:{
          eager:true
        },
        articlePrices:{
            eager:true
        },
        articleFeatures:{
          eager:true
        },
        features:{
          eager:true
        }
    }
  },
  routes:{
    exclude:["updateOneBase","replaceOneBase","deleteOneBase"]
  }
})
export class ArticleController{
  constructor(public service:ArticleService,public photoService:PhotoService) {}

    @Post('createFull')
    createFullArticle(@Body() data: AddArticleDto){
      return this.service.createFullArticle(data);
    }

    @Patch(":id")
    editFullArticle(@Param('id')id:number,@Body()data:EditArticleDto){
    return this.service.editFullArticle(id,data);
    }

     @Post(':id/uploadPhoto')
      @UseInterceptors(
      FileInterceptor('photo',{
        storage:diskStorage({
          destination: StorageConfig.photo.destination,
          filename:(req,file,callback)=>{
            let original:string = file.originalname;
            let normalized=original.replace(/\s+/g,'-');
            normalized=normalized.replace(/[^A-z0-9\.\-]/g,"");
            let sada=new Date();
            let datePart='';
            datePart+=sada.getFullYear().toString();
            datePart+=(sada.getMonth()+1).toString();
            datePart+=sada.getDate().toString();

            let randomPart:string=
              new Array(10).
                fill(0)
                .map(e=>(Math.random()*9).toFixed(0).toString())
              .join('');

            let fileName=datePart + '-' + randomPart + '-' + normalized;
            callback(null,fileName);
          }

        }),

        fileFilter:(req,file,callback)=> {
          if(!(file.originalname.match(/\.(jpg|png)$/))){
            req.fileFilterError="Bad file extension!";
            callback(null,false);
            return;
          }

          if(!(file.mimetype.includes('jpeg')||file.mimetype.includes('png'))){
            req.fileFilterError="Bad file content!";
            callback(null,false);
            return

          }
          callback(null,true);
        },
        limits: {
          files:1,
          fileSize:StorageConfig.photo.maxSize
        }
      })
    )
    async uploadPhoto(
        @Param('id')articleId:number
       ,@UploadedFile()photo,
        @Req()req)
       :Promise<ApiResponse | Photo>{

        if(req.fileFilterError){
          return new ApiResponse('error',-4002,req.fileFilterError);

        }
        if(!photo){
          return new ApiResponse('error',-4002,"File not uploader");

        }


       /*const tempDir = os.tmpdir();
       const file = req.files[tempDir]
       const type = filetype(readFileSync())[0]?.typename;

        if(!type){
          fs.unlinkSync(photo.path);
          return new ApiResponse('error',-4002,"Cannot detect file type");

        }


        if(!(type.includes('jpeg')||type.includes('png'))){
          fs.unlinkSync(photo.path);
          return new ApiResponse('error',-4002,"Bad file content type");
        }

         await this.createResizedImage(photo,StorageConfig.photo.resize.thumb)
         await this.createResizedImage(photo,StorageConfig.photo.resize.small)
*/
        let newPhoto:Photo=new Photo();
        newPhoto.articleId=articleId;
        newPhoto.imagePath=photo.filename;

        const savedPhoto= await this.photoService.add(newPhoto);

        if(!savedPhoto){
          return new ApiResponse("error",-4001);

        }

        return savedPhoto;

  }

  async createResizedImage(photo,resizeSettings){
    const originalFilePath=photo.path;
    const fileName=photo.filename;

    const destinationFilePath=StorageConfig.photo.destination
      +resizeSettings.directory
      +fileName;

    await sharp(originalFilePath)
      .resize({
        fit:'cover',
        width:resizeSettings.width,
        height:resizeSettings.height,
      })
      .toFile(destinationFilePath)
  }
      //http://localhost:3000/api/article/1/deletePhoto/2
    @Delete(':articleId/deletePhoto/:photoId')
      public async deletePhoto(
        @Param('articleId')articleId:number,
        @Param('photoId') photoId:number){

    const photo=await this.photoService.findOne({where:{
      articleId:articleId,
      photoId:photoId
    }})
      if(!photo){
        return new ApiResponse('error',-4004,"Photo not found");

      }

      try{
        fs.unlinkSync(StorageConfig.photo.destination+photo.imagePath)
        /*fs.unlinkSync(StorageConfig.photo.destination+
                      StorageConfig.photo.resize.thumb.directory+photo.imagePath)
        fs.unlinkSync(StorageConfig.photo.destination+
          StorageConfig.photo.resize.small.directory+photo.imagePath)
        */
      }catch(e){

      }

     const deleteResut =await this.photoService.deleteById(photoId);

      if(deleteResut.affected==0){
        return new ApiResponse('error',-4004,"Photo not found");
      }

     return new ApiResponse('ok',0,"One photo deleted");
  }
}