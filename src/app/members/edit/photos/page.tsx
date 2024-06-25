import { getAuthUserId } from '@/actions/authActions';
import { getMemberByUserId, getMemberPhotosByUserId } from '@/actions/memberActions';
import DeleteButton from '@/components/DeleteButton';
import MemberImage from '@/components/MemberImage';
import StarButton from '@/components/StarButton';
import { CardBody, CardHeader, Divider } from '@nextui-org/react';
import MemberPhotoUpload from './MemberPhotoUpload';
import MemberPhotos from '@/components/MemberPhotos';

export default async function PhotosPage() {
  const userId = await getAuthUserId();
  const member = await getMemberByUserId(userId);
  const photos = await getMemberPhotosByUserId(userId);

  return (
    <>
      <CardHeader className='text-2xl font-semibold text-secondary'>
        Edit Profile
      </CardHeader>
      <Divider/>
      <CardBody>
        <MemberPhotoUpload/>
        <MemberPhotos photos={photos} editing={true} mainImageUrl={member?.image} />
      </CardBody>
    </>
  )
}
