import { getAuthUserId } from '@/actions/authActions';
import { getMemberPhotosByUserId } from '@/actions/memberActions';
import DeleteButton from '@/components/DeleteButton';
import MemberImage from '@/components/MemberImage';
import StarButton from '@/components/StarButton';
import { CardBody, CardHeader, Divider } from '@nextui-org/react';
import MemberPhotoUpload from './MemberPhotoUpload';

export default async function PhotosPage() {
  const userId = await getAuthUserId();
  const photos = await getMemberPhotosByUserId(userId);

  return (
    <>
      <CardHeader className='text-2xl font-semibold text-secondary'>
        Edit Profile
      </CardHeader>
      <Divider/>
      <CardBody>
        <MemberPhotoUpload/>
        <div className="grid grid-cols-5 gap-3 p-5">
          {photos && photos.map(photo => (
            <div key={photo.id} className="relative">
              <MemberImage photo={photo}/>
              <div className="absolute top-3 left-3 z-50">
                <StarButton selected={true} loading={true}/>
              </div>
              <div className="absolute top-3 right-3 z-50">
                <DeleteButton loading={true}/>
              </div>
            </div>
          ))}
        </div>
      </CardBody>
    </>
  )
}
