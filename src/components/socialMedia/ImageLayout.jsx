import Masonry from 'react-masonry-css';
import Pin from './ImagePost';

const breakpointObj = {
  default: 3,
  // 3000: 6,
  // 2000: 5,
  1500: 4,
  1200: 3,
  1000: 2,
  // 500: 1,
};

const MasonryLayout = ({ pins }) => {
  return (
    <Masonry className="flex animate-slide-fwd" breakpointCols={breakpointObj}>
      {/* breakpointCols={breakpointCols} */}
      {pins?.map((pin) => (
        <Pin key={pin._id} pin={pin} className="w-max" />
      ))}
    </Masonry>
  );
};

export default MasonryLayout;
