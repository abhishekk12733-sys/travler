import { useTravel } from '../utils/travelContext';
import InteractiveMap from '../components/InteractiveMap';

const MapPage = () => {
  const { travelLogs, wishlist } = useTravel();

  return <InteractiveMap travelLogs={travelLogs} wishlist={wishlist} />;
};

export default MapPage;
