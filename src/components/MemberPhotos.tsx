'use client';

import { deletePhoto, setMainPhoto } from '@/actions/userActions';
import { Photo } from '@prisma/client';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import DeleteButton from './DeleteButton';
import MemberImage from './MemberImage';
import StarButton from './StarButton';


type Props = {
  photos:Photo[] | null | undefined;
  editing?:boolean;
  mainImageUrl?:string | null;
}

const defaultLoading = {
  type:'',
  isLoading:false,
  id:''
}

export default function MemberPhotos({photos, editing, mainImageUrl}:Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(defaultLoading);
  const {data: session, update} = useSession(); 

  const onSetMain = async (photo:Photo) => {
    if(photo.url === mainImageUrl) {return;}
    setLoading({isLoading:true, id:photo.id, type: 'main'});
    await setMainPhoto(photo);
    await update({
      ...session, 
      user: {
        ...session?.user,
        picture:photo.url //even though photo is not the name of image on our model but next auth uses a photo
      }  
    });
    
    router.refresh();
    setLoading(defaultLoading)    
  }

  const onDelete = async (photo:Photo) => {
    if(photo.url === mainImageUrl) {return;}
    setLoading({isLoading:true, id:photo.id, type: 'delete'});
    await deletePhoto(photo);
    router.refresh();
    setLoading(defaultLoading)    
  }

  return (
    <div className="grid grid-cols-5 gap-3 p-5">
      {photos && photos.map(photo => (
        <div key={photo.id} className="relative">
          <MemberImage photo={photo}/>
          {editing && (
            <>
              <div 
                onClick={() => onSetMain(photo)} 
                className="absolute top-3 left-3 z-50"
              >
                <StarButton 
                  selected={photo.url === mainImageUrl} 
                  loading={
                    loading.isLoading
                    && loading.type === 'main'
                    && loading.id === photo.id
                  }
                />
              </div>
              <div
                onClick={() => onDelete(photo)} 
                className="absolute top-3 right-3 z-50"
              >
                <DeleteButton 
                  loading={
                    loading.isLoading
                    && loading.type === 'delete'
                    && loading.id === photo.id
                  }
                />
              </div>
            </>
          )}
        </div>
      ))}
    </div>
  )
}
